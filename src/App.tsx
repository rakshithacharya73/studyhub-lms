import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/Views/LoginView';
import { CategoryView } from './components/Views/CategoryView';
import { TopicView } from './components/Views/TopicView';
import { ClassView } from './components/Views/ClassView';
import { VideoView } from './components/Views/VideoView';
import { QuizView } from './components/Views/QuizView';
import { TeacherDashboard } from './components/Views/TeacherDashboard';
import { AdminDashboard } from './components/Views/AdminDashboard';
import { LeaderboardView } from './components/Views/LeaderboardView';
import { AIChatBot } from './components/AIChatBot';
import { mockCategories } from './data/mockData';
import { CategoryData, TopicData, ClassData, User } from './types';
import { auth, signOut, db, collection, query, getDocs, where } from './config/mockFirebase';
import { calculateTotalPoints, getBadgeForPoints, generateLeaderboard } from './utils/gamification';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [currentView, setCurrentView] = useState<'categories' | 'topics' | 'classes' | 'video' | 'quiz' | 'leaderboard'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [allQuizAttempts, setAllQuizAttempts] = useState<any[]>([]);
  const [schoolUsers, setSchoolUsers] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?.role === 'student') {
      const fetchRealtime = async () => {
        try {
          const q = query(collection(db, 'uploadedVideos'), where('schoolCode', '==', currentUser.schoolCode));
          const snap = await getDocs(q);
          const vids: any[] = [];
          if (snap && snap.forEach) {
            snap.forEach((d: any) => vids.push({ id: d.id, ...d.data() }));
          }
          setUploadedVideos(vids);
          
          const qq = query(collection(db, 'quizAttempts'), where('schoolCode', '==', currentUser.schoolCode));
          const qSnap = await getDocs(qq);
          const atts: any[] = [];
          const myAtts: any[] = [];
          if (qSnap && qSnap.forEach) {
            qSnap.forEach((d: any) => {
              const data = typeof d.data === 'function' ? d.data() : d.data;
              atts.push(data);
              if (data.studentId === currentUser.uid) {
                myAtts.push(data);
              }
            });
          }
          setAllQuizAttempts(atts);
          setQuizAttempts(myAtts);
          
          const uq = query(collection(db, 'users'), where('schoolCode', '==', currentUser.schoolCode));
          const uSnap = await getDocs(uq);
          const usersList: any[] = [];
          if (uSnap && uSnap.forEach) {
            uSnap.forEach((d: any) => {
              const data = typeof d.data === 'function' ? d.data() : d.data;
              usersList.push(data);
            });
          }
          setSchoolUsers(usersList);
        } catch(e) {
          console.error(e);
        }
      };
      
      fetchRealtime();
      const interval = setInterval(fetchRealtime, 2000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Derived state to guarantee perfect sync
  const videoCountsByClass: Record<string, number> = {};
  uploadedVideos.forEach(v => {
    if (v.classId) {
      videoCountsByClass[v.classId] = (videoCountsByClass[v.classId] || 0) + 1;
    }
  });

  const appCategories = mockCategories.map(c => {
    let catVideosCount = 0;
    const newTopics = c.topics.map(t => {
      let topVideosCount = 0;
      const newClasses = t.classes.map(cls => {
        const count = videoCountsByClass[cls.id] || 0;
        topVideosCount += count;
        return { ...cls, videosCount: count };
      });
      catVideosCount += topVideosCount;
      return { ...t, videosCount: topVideosCount, classes: newClasses };
    });
    return { ...c, videosCount: catVideosCount, topics: newTopics };
  });

  const activeCategory = appCategories.find(c => c.id === selectedCategory?.id) || selectedCategory;
  const activeTopic = activeCategory?.topics.find(t => t.id === selectedTopic?.id) || selectedTopic;
  const activeClass = activeTopic?.classes.find(cls => cls.id === selectedClass?.id) || selectedClass;

  const totalVideos = uploadedVideos.length;
  const totalMins = totalVideos * 15;
  const formattedTime = totalMins > 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`;
  const userPoints = calculateTotalPoints(quizAttempts);
  const userBadge = getBadgeForPoints(userPoints);
  const leaderboardData = generateLeaderboard(allQuizAttempts, schoolUsers);

  const studentStats = {
    videos: totalVideos,
    courses: Object.keys(videoCountsByClass).length,
    learningTime: formattedTime,
    completed: quizAttempts.length,
    points: userPoints,
    badge: userBadge
  };

  const handleSelectCategory = (category: CategoryData) => {
    setSelectedCategory(category);
    setCurrentView('topics');
  };

  const handleSelectTopic = (topic: TopicData) => {
    setSelectedTopic(topic);
    setCurrentView('classes');
  };

  const handleSelectClass = (classInfo: ClassData) => {
    setSelectedClass(classInfo);
    setCurrentView('video');
  };

  const handleProceedToQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentView('categories');
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentView('topics');
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setCurrentView('classes');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentView('categories');
      setSelectedCategory(null);
      setSelectedTopic(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginView onLogin={(role, schoolCode, name, uid) => {
      setCurrentUser({ role: role as 'teacher'|'student', schoolCode, name, uid, email: '' });
      setIsAuthenticated(true);
    }} />;
  }

  const renderDashboardContent = () => {
    if (currentUser.role === 'teacher') return <TeacherDashboard currentUser={currentUser} />;
    
    // Admin role is theoretically handled if we supported it, but we skip Admin UI
    if (currentUser.role as any === 'admin') return <AdminDashboard />;
    
    // Student Flow
    return (
      <>
        {(currentView === 'categories' || currentView === 'leaderboard') && (
          <div className="pt-8 px-8 max-w-7xl mx-auto flex justify-center mb-2">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 shadow-inner">
              <button
                onClick={() => setCurrentView('categories')}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                  currentView === 'categories'
                    ? 'bg-white text-brand-indigo shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📚 Learning Categories
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  currentView === 'leaderboard'
                    ? 'bg-white text-brand-indigo shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏆 Class Leaderboard
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'categories' && (
          <CategoryView 
            categories={appCategories} 
            onSelectCategory={handleSelectCategory} 
          />
        )}
        {currentView === 'leaderboard' && (
          <LeaderboardView leaderboard={leaderboardData} />
        )}
        {currentView === 'topics' && activeCategory && (
          <TopicView 
            category={activeCategory} 
            onBack={handleBackToCategories}
            onSelectTopic={handleSelectTopic}
          />
        )}
        {currentView === 'classes' && activeCategory && activeTopic && (
          <ClassView 
            category={activeCategory}
            topic={activeTopic}
            onBack={handleBackToTopics}
            onSelectClass={handleSelectClass}
          />
        )}
        {currentView === 'video' && activeClass && (
          <VideoView
            classInfo={activeClass}
            currentUser={currentUser}
            onBack={handleBackToClasses}
            onProceedToQuiz={handleProceedToQuiz}
          />
        )}
        {currentView === 'quiz' && activeClass && (
          <QuizView
            classInfo={activeClass}
            currentUser={currentUser}
            onBack={() => setCurrentView('video')}
          />
        )}
        <AIChatBot />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header userRole={currentUser.role} onLogout={handleLogout} studentStats={studentStats} />
      <main className="flex-1 w-full relative">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default App;
