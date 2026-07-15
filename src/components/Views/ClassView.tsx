import React, { useState } from 'react';
import { CategoryData, TopicData, ClassData } from '../../types';
import { IconArrowLeft, IconSearch, IconGraduationCapSmall, IconPlayCircle, IconMicroscope, IconCalculator, IconCode2, IconBookOpen } from '../icons';

interface ClassViewProps {
  category: CategoryData;
  topic: TopicData;
  onBack: () => void;
  onSelectClass: (c: ClassData) => void;
}

export const ClassView: React.FC<ClassViewProps> = ({ category, topic, onBack, onSelectClass }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Class 10', 'Class 8', 'Class 9'];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'microscope': return <IconMicroscope className="text-white" />;
      case 'calculator': return <IconCalculator className="text-white" />;
      case 'code': return <IconCode2 className="text-white" />;
      case 'book':
      default: return <IconBookOpen className="text-white" />;
    }
  };

  const getFilterCount = (filter: string) => {
    if (filter === 'All') return topic.videosCount;
    const classData = topic.classes.find(c => c.name === filter);
    return classData ? classData.videosCount : 0;
  };

  const filteredClasses = activeFilter === 'All' 
    ? topic.classes 
    : topic.classes.filter(c => c.name === activeFilter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors"
      >
        <IconArrowLeft className="text-gray-700" />
        Back to {category.name}
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{category.name} - {topic.name}</h2>
        <p className="text-gray-500">{topic.classesCount} classes available</p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
             <IconSearch className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search classes and videos..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Browse Classes</h3>
        <p className="text-gray-500 text-sm mb-4">Choose a class to start learning</p>
        
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-2 mr-2">
            <IconGraduationCapSmall className="text-gray-500" /> Filter by Class:
          </span>
          {filters.map((filter) => {
            const count = getFilterCount(filter);
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border
                  ${isActive 
                    ? 'bg-brand-blue text-white border-brand-blue' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {filter}
                <span className={`flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[10px] 
                  ${isActive ? 'bg-orange-400 text-white' : 'bg-orange-400 text-white'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div 
            key={cls.id}
            onClick={() => onSelectClass(cls)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col h-[240px] cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`h-36 ${cls.gradientClass} p-5 flex flex-col relative`}>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {getIcon(topic.icon)}
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <IconPlayCircle className="text-white" />
                  {cls.videosCount} videos
                </span>
              </div>
            </div>
            <div className="p-5 bg-white flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-gray-900 mb-1">{cls.name}</h4>
              <p className="text-gray-500 text-sm leading-snug line-clamp-2">
                {cls.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
