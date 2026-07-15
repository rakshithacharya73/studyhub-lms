import React from 'react';
import { IconGraduationCap, IconVideo, IconBookOpen, IconClock, IconCheckCircle2 } from './icons';
import { BadgeTier } from '../utils/gamification';

interface HeaderProps {
  onLogout: () => void;
  userRole: string | null;
  studentStats?: { 
    videos: number, 
    courses: number, 
    learningTime: string, 
    completed: number,
    points?: number,
    badge?: BadgeTier
  };
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userRole, studentStats }) => (
  <div className="w-full bg-white px-8 py-4 shadow-sm border-b border-gray-100 flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-brand-indigo rounded-xl p-2 shadow-sm text-white flex items-center justify-center">
          <IconGraduationCap />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">StudyHub</h1>
          <p className="text-sm text-gray-400">Learning Management System</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {userRole === 'student' && studentStats?.badge && (
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${studentStats.badge.color} shadow-sm mr-2 transition-all hover:scale-105`}>
            <span className="text-lg">{studentStats.badge.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none">{studentStats.badge.name}</span>
              <span className="text-xs font-medium opacity-80 leading-tight">{studentStats.points} Points</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {userRole && <span className="text-sm font-semibold text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full border border-gray-200">{userRole}</span>}
          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
            title="Logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
    
    {userRole === 'student' && studentStats && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-center transition-all hover:shadow-md hover:border-blue-200">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
            <IconVideo />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{studentStats.videos}</div>
          <div className="text-sm text-gray-500 font-medium">Video Lessons Available</div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-center transition-all hover:shadow-md hover:border-indigo-200">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
            <IconBookOpen />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{studentStats.courses}</div>
          <div className="text-sm text-gray-500 font-medium">Active Courses</div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-center transition-all hover:shadow-md hover:border-orange-200">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
            <IconClock />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{studentStats.learningTime}</div>
          <div className="text-sm text-gray-500 font-medium">Total Learning Time</div>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-center transition-all hover:shadow-md hover:border-green-200">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3">
            <IconCheckCircle2 />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{studentStats.completed}</div>
          <div className="text-sm text-gray-500 font-medium">Quizzes Completed</div>
        </div>
      </div>
    )}
  </div>
);
