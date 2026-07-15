import React, { useState } from 'react';
import { ClassData, User } from '../../types';
import { IconArrowLeft } from '../icons';
import { db, collection, addDoc, serverTimestamp } from '../../config/mockFirebase';

interface QuizViewProps {
  classInfo: ClassData;
  currentUser: User;
  onBack: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ classInfo, currentUser, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      question: "What did you observe about the angles of incidence and reflection?",
      options: ["They are always equal", "Angle of incidence is greater", "Angle of reflection is greater", "They are unrelated"],
      answer: 0
    },
    {
      question: "How do the mirrors inside a kaleidoscope create symmetrical patterns?",
      options: ["Through multiple reflections", "By refracting light", "By absorbing light", "Through dispersion"],
      answer: 0
    },
    {
      question: "What happens to the number of images formed as the angle between two mirrors decreases?",
      options: ["The number of images increases", "The number of images decreases", "It stays the same", "Only one image is formed"],
      answer: 0
    },
    {
      question: "What does the First Law of Reflection state about the incident ray, reflected ray, and normal?",
      options: ["They always lie in the same plane", "They are perpendicular to each other", "They are parallel to each other", "They lie in different planes"],
      answer: 0
    }
  ];

  if (!quizStarted) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors">
          <IconArrowLeft className="text-gray-700" /> Back to Classes
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{classInfo.name} Quiz</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Test your knowledge on the topics covered in this class. There are {questions.length} questions in total.</p>
          <button onClick={() => setQuizStarted(true)} className="bg-brand-indigo text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-brand-blue transition-colors text-lg">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors">
          <IconArrowLeft className="text-gray-700" /> Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-xl text-gray-700 mb-6 font-medium">You scored {score} out of {questions.length}</p>
          <button onClick={() => { setQuizStarted(false); setCurrentQuestion(0); setScore(0); setShowResults(false); setSelectedOption(null); }} className="bg-brand-indigo text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-brand-blue transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  const handleNext = async () => {
    let newScore = score;
    if (selectedOption === q.answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
      // Save attempt to Firestore
      try {
        await addDoc(collection(db, 'quizAttempts'), {
          studentId: currentUser.uid,
          studentName: currentUser.name,
          schoolCode: currentUser.schoolCode,
          classId: classInfo.id,
          className: classInfo.name,
          score: newScore,
          totalQuestions: questions.length,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving score to Firebase", err);
      }
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors">
        <IconArrowLeft className="text-gray-700" /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 leading-snug">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedOption(i)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedOption === i ? 'border-brand-indigo bg-indigo-50 font-semibold text-brand-indigo' : 'border-gray-100 hover:border-gray-200 text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button 
            disabled={selectedOption === null}
            onClick={handleNext} 
            className={`px-8 py-2.5 rounded-xl font-bold shadow-sm transition-colors ${selectedOption === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-indigo text-white hover:bg-brand-blue'}`}
          >
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
