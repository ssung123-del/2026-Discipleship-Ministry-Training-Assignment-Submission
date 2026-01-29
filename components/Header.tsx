import React from 'react';
import { BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
              2026 제자 사역훈련<br className="sm:hidden" /> 과제 제출
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};