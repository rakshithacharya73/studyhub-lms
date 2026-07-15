import React from 'react';
import { CategoryData } from '../../types';
import { IconMicroscope, IconCalculator, IconCode2, IconBookOpen, IconArrowRight } from '../icons';

interface CategoryViewProps {
  categories: CategoryData[];
  onSelectCategory: (category: CategoryData) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categories, onSelectCategory }) => {
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Learning Categories</h2>
        <p className="text-gray-500 text-sm">Select a category to explore topics and activities</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group flex flex-col h-[280px]"
          >
            <div className={`h-48 ${category.gradientClass} p-6 flex flex-col relative`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {getIcon(category.icon)}
                </div>
                <IconArrowRight className="text-white opacity-80 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-auto flex gap-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {category.topicsCount} Topics
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {category.videosCount} Videos
                </span>
              </div>
            </div>
            <div className="p-5 bg-white flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm leading-snug line-clamp-2">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
