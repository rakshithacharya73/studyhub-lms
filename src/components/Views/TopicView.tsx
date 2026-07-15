import React from 'react';
import { CategoryData, TopicData } from '../../types';
import { IconArrowLeft, IconArrowRight, IconMicroscope, IconCalculator, IconCode2, IconBookOpen } from '../icons';

interface TopicViewProps {
  category: CategoryData;
  onBack: () => void;
  onSelectTopic: (topic: TopicData) => void;
}

export const TopicView: React.FC<TopicViewProps> = ({ category, onBack, onSelectTopic }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'microscope': return <IconMicroscope className="text-white" />;
      case 'calculator': return <IconCalculator className="text-white" />;
      case 'code': return <IconCode2 className="text-white" />;
      case 'book':
      default: return <IconBookOpen className="text-white" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-6 hover:bg-gray-50 transition-colors"
      >
        <IconArrowLeft className="text-gray-700" />
        Back to Categories
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{category.name}</h2>
        <p className="text-gray-500">{category.topicsCount} topics available</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Browse Topics</h3>
        <p className="text-gray-500 text-sm">Choose a topic to explore activities and classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {category.topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group flex flex-col h-[260px]"
          >
            <div className={`h-40 ${topic.gradientClass} p-6 flex flex-col relative`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {getIcon(topic.icon)}
                </div>
                <div className="flex gap-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {topic.classesCount} Classes
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {topic.videosCount} Videos
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white flex-1 flex flex-col relative">
              <h4 className="text-lg font-bold text-gray-900 mb-1 pr-8">{topic.name}</h4>
              <p className="text-gray-500 text-sm leading-snug line-clamp-2 pr-6">
                {topic.description}
              </p>
              <div className="absolute right-5 bottom-5">
                 <IconArrowRight className="text-gray-400 group-hover:text-gray-700 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
