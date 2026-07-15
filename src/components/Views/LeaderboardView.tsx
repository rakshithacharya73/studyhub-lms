import React from 'react';
import { LeaderboardEntry } from '../../utils/gamification';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboard }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-4xl">🏆</span> Class Leaderboard
          </h2>
          <p className="text-gray-500">Compete with your classmates and earn badges by completing quizzes!</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No students found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leaderboard.map((entry, index) => {

              const rankColor = index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                               index === 1 ? 'bg-slate-100 text-slate-700' : 
                               index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-gray-50 text-gray-500';
                               
              return (
                <div key={entry.studentId} className={`p-6 flex items-center gap-6 transition-all hover:bg-gray-50 ${index === 0 ? 'bg-yellow-50/30' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${rankColor}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{entry.studentName}</h3>
                    <p className="text-sm text-gray-500">Completed {entry.quizzesTaken} quizzes</p>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${entry.badge.color}`}>
                    <span className="text-xl">{entry.badge.icon}</span>
                    <span className="font-bold text-sm hidden sm:block">{entry.badge.name}</span>
                  </div>
                  
                  <div className="text-right w-24">
                    <div className="text-2xl font-bold text-brand-indigo">{entry.points}</div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
