
import React, { useState } from 'react';
import { ArrowLeft, Search, Wrench, PlayCircle, Lock } from 'lucide-react';
import { Course, Employee } from '../types.ts';

interface LearningCenterProps {
  onBack: () => void;
  courses: Course[];
  user: Employee;
}

export const LearningCenter: React.FC<LearningCenterProps> = ({ onBack, courses, user }) => {
  const filters = ['全部', '企业文化', '通用技能', '专业技能'];
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Permission Check Logic
  const checkPermission = (course: Course) => {
      const { departments, levels } = course.permissions;
      
      // Check Department
      const deptAllowed = departments.includes('all') || departments.includes(user.department);
      // Check Level
      const levelAllowed = levels.includes('all') || levels.includes(user.level);
      
      return deptAllowed && levelAllowed;
  };

  // Filter Logic
  const visibleCourses = courses.filter(course => {
      const hasPermission = checkPermission(course);
      const matchesFilter = activeFilter === '全部' || course.category === activeFilter;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Show all courses, but lock the ones without permission? 
      // Or hide them? Requirement says "Manage permissions... separate departments". Usually means hide.
      // Let's show but lock if it's close, or just hide. Let's hide for cleaner "personalized" view.
      return hasPermission && matchesFilter && matchesSearch;
  });

  const CourseGrid = ({ list }: { list: Course[] }) => {
      if (list.length === 0) return <div className="col-span-full text-center text-slate-400 py-12">暂无相关课程</div>;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {list.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group flex flex-col border border-slate-100">
                {/* Video Thumbnail Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img 
                        src={course.imageUrl} 
                        alt="Video Thumbnail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Play Icon Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors z-20">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle size={48} className="text-white drop-shadow-lg" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md z-30">
                        {course.category}
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <div className="mt-auto pt-3">
                        <button className="w-full bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold py-2.5 rounded-xl transition-all border border-blue-100 hover:border-blue-600 shadow-sm active:scale-95">
                            立即学习
                        </button>
                    </div>
                </div>
            </div>
        ))}
        </div>
      );
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex flex-col items-center selection:bg-blue-100">
      
      {/* Unified Header Section */}
      <div className="w-full flex items-center justify-center py-8 gap-6 relative z-10">
        <button 
            onClick={onBack} 
            className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-slate-200/60 active:scale-95"
        >
            <ArrowLeft size={20} /> <span className="font-bold">返回</span>
        </button>
        
        {/* Unified Branding */}
        <div className="flex items-center gap-3 select-none opacity-90 scale-90 md:scale-100">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
                <Wrench size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-slate-800 font-bold text-2xl tracking-widest">急修到家</span>
                <span className="text-blue-600 text-[10px] tracking-[0.3em] font-bold mt-0.5">JIXIU DAOJIA</span>
            </div>
        </div>
        <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
        <h1 className="text-2xl font-bold text-slate-700 tracking-wide hidden md:block">学习中心</h1>
      </div>

      <div className="w-full max-w-[1400px] px-6 pb-20 flex flex-col items-center">
          
           {/* Search Bar */}
           <div className="flex w-full max-w-[900px] mt-4 mb-10 shadow-xl shadow-blue-100/50 rounded-2xl">
              <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索课程视频..." 
                    className="w-full h-16 border-0 rounded-l-2xl px-8 text-xl text-slate-700 placeholder-slate-400 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-28 rounded-r-2xl flex items-center justify-center transition-colors shadow-md">
                  <Search size={28} />
              </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12 w-full overflow-x-auto py-2 no-scrollbar">
              <span className="text-slate-500 text-lg mr-2 font-medium whitespace-nowrap">课程分类:</span>
              <div className="flex gap-4">
                {filters.map((filter, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveFilter(filter)}
                        className={`
                            border px-8 py-2.5 rounded-xl text-lg transition-all duration-200 min-w-[100px] whitespace-nowrap font-medium
                            ${activeFilter === filter 
                                ? 'bg-slate-800 text-white border-slate-800 shadow-lg' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-md'}
                        `}
                    >
                        {filter}
                    </button>
                ))}
              </div>
          </div>

          {/* Courses Grid - Dynamic */}
          <div className="w-full">
             <CourseGrid list={visibleCourses} />
          </div>

      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
