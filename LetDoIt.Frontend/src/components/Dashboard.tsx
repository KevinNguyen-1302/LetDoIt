// import React from 'react';
// import { Filter, SortDesc, MoreVertical, Video, Dumbbell, ShoppingBasket, Leaf, BookOpen } from 'lucide-react';
// import clsx from 'clsx';
// import { toast } from 'react-toastify';

// const Dashboard = () => {
//   const showToast = (title) => {
//     toast(`Task "${title}" clicked!`, {
//       icon: "✨",
//       style: { fontFamily: '"Yomogi", cursive' }
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto h-full flex flex-col">
//       {/* Header */}
//       <div className="flex justify-between items-end mb-8">
//         <div>
//           <h2 className="font-cherry text-5xl text-[#5E548E] tracking-wide mb-2">Today's Flow</h2>
//           <p className="text-gray-500">Organize your thoughts, one tile at a time.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium">
//             <Filter size={18} />
//             Filter
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium">
//             <SortDesc size={18} />
//             Sort
//           </button>
//         </div>
//       </div>

//       {/* Bento Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
//         {/* Left Column (Urgent) */}
//         <div className="col-span-1 flex flex-col gap-6">
//           <div 
//             className="bg-white rounded-4xl p-8 border border-brand-red/20 shadow-sm flex-1 flex flex-col relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
//             onClick={() => showToast('Design Review')}
//           >
//             <div className="flex justify-between items-start mb-auto">
//               <span className="bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-full font-sans tracking-widest uppercase">
//                 Urgent
//               </span>
//               <button className="text-gray-400 hover:text-gray-600">
//                 <MoreVertical size={20} />
//               </button>
//             </div>
            
//             <div className="mt-12">
//               <h3 className="font-cherry text-4xl text-brand-red mb-4">Design Review</h3>
//               <p className="text-gray-600 leading-relaxed mb-8">
//                 Finalize the mobile dashboard components and ensure glassmorphism consistency across all priority states.
//               </p>
              
//               <div className="flex items-center gap-4 mt-auto">
//                 <div className="flex -space-x-3">
//                   <img className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
//                   <img className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" alt="Avatar" />
//                 </div>
//                 <span className="text-xs font-bold text-gray-500 font-sans">Due in 2 hours</span>
//               </div>
//             </div>
//             {/* Subtle background glow */}
//             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl group-hover:bg-brand-red/10 transition-colors"></div>
//           </div>
//         </div>

//         {/* Right Columns (2 spans) */}
//         <div className="col-span-2 flex flex-col gap-6">
          
//           {/* Top Row: High Priority */}
//           <div 
//             className="bg-white rounded-4xl p-6 border border-brand-yellow/30 shadow-sm cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md relative overflow-hidden group"
//             onClick={() => showToast('Client Discovery Call')}
//           >
//             <div className="flex gap-6 items-center">
//               <div className="w-16 h-16 rounded-2xl bg-[#FCFCE3] flex items-center justify-center text-brand-yellow/80">
//                 <Video size={28} />
//               </div>
//               <div className="flex-1">
//                 <span className="bg-[#FCFCE3] text-brand-yellow text-[10px] font-bold px-2 py-0.5 rounded font-sans tracking-wider uppercase mb-2 inline-block">
//                   High Priority
//                 </span>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-cherry text-2xl text-gray-800 mb-1">Client Discovery Call</h3>
//                     <p className="text-sm text-gray-500">Review technical requirements for the LetDoIt API integration.</p>
//                   </div>
//                   <span className="font-bold font-sans text-lg">14:00</span>
//                 </div>
//               </div>
//             </div>
//             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-brand-yellow/10 transition-colors"></div>
//           </div>

//           {/* Middle Row: Normal Priority */}
//           <div className="grid grid-cols-2 gap-6 h-48">
//             <div 
//               className="bg-white rounded-4xl p-6 border border-brand-blue/10 shadow-sm flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md group"
//               onClick={() => showToast('Gym')}
//             >
//               <div className="w-12 h-12 rounded-xl bg-[#F0F0FE] flex items-center justify-center text-brand-blue mb-auto">
//                 <Dumbbell size={24} />
//               </div>
//               <div>
//                 <h3 className="font-cherry text-2xl text-gray-800 mb-1">Gym</h3>
//                 <p className="text-xs font-bold text-gray-400 font-sans uppercase">Leg Day Focus</p>
//               </div>
//             </div>

//             <div 
//               className="bg-white rounded-4xl p-6 border border-brand-blue/10 shadow-sm flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md group"
//               onClick={() => showToast('Groceries')}
//             >
//               <div className="w-12 h-12 rounded-xl bg-[#F0F0FE] flex items-center justify-center text-brand-blue mb-auto">
//                 <ShoppingBasket size={24} />
//               </div>
//               <div>
//                 <h3 className="font-cherry text-2xl text-gray-800 mb-1">Groceries</h3>
//                 <p className="text-xs font-bold text-gray-400 font-sans uppercase">Organic Produce</p>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Row: Lowest Priority + Chart */}
//           <div className="grid grid-cols-3 gap-6 flex-1 min-h-35">
//             {/* Progress/Habit 1 */}
//             <div 
//               className="bg-white rounded-4xl p-5 border border-brand-green/20 shadow-sm flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
//               onClick={() => showToast('Water Plants')}
//             >
//               <Leaf size={24} className="text-brand-green mb-auto" />
//               <div>
//                 <h3 className="font-cherry text-xl text-gray-800 mb-1">Water Plants</h3>
//                 <p className="text-xs font-bold text-gray-400 font-sans uppercase">Sunday Ritual</p>
//               </div>
//             </div>

//             {/* Progress/Habit 2 */}
//             <div 
//               className="bg-white rounded-4xl p-5 border border-brand-green/20 shadow-sm flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md"
//               onClick={() => showToast('Read 10pgs')}
//             >
//               <BookOpen size={24} className="text-brand-green mb-auto" />
//               <div>
//                 <h3 className="font-cherry text-xl text-gray-800 mb-1">Read 10pgs</h3>
//                 <p className="text-xs font-bold text-gray-400 font-sans uppercase">Progress: 45%</p>
//               </div>
//             </div>

//             {/* Momentum Chart */}
//             <div className="bg-white rounded-4xl p-5 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
//               <h3 className="font-cherry text-lg text-gray-800 mb-4 z-10 relative">Weekly Momentum</h3>
              
//               <div className="flex items-end gap-1.5 mt-auto h-16 z-10 relative opacity-80">
//                 <div className="w-full bg-brand-green/40 rounded-t-sm h-[30%] hover:h-[35%] transition-all"></div>
//                 <div className="w-full bg-brand-blue/40 rounded-t-sm h-[50%] hover:h-[55%] transition-all"></div>
//                 <div className="w-full bg-brand-yellow/40 rounded-t-sm h-[80%] hover:h-[85%] transition-all"></div>
//                 <div className="w-full bg-brand-red/40 rounded-t-sm h-[40%] hover:h-[45%] transition-all"></div>
//                 <div className="w-full bg-[#5E548E]/40 rounded-t-sm h-[60%] hover:h-[65%] transition-all"></div>
//                 <div className="w-full bg-gray-300 rounded-t-sm h-[20%] hover:h-[25%] transition-all"></div>
//               </div>

//               {/* Decorative elements */}
//               <div className="absolute right-0 bottom-0 w-1/3 h-full bg-linear-to-l from-gray-200 to-transparent"></div>
//               <svg className="absolute right-2 bottom-4 w-12 h-12 text-white/50 stroke-3 fill-none stroke-current transform rotate-12" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
