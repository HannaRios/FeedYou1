import React from "react";
import { Home, Search, Bell, User, Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

export default function PhoneMockup() {
  return (
    <div className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[640px] bg-slate-900 rounded-[3rem] sm:rounded-[3.5rem] p-3 shadow-2xl ring-1 ring-white/20 select-none mx-auto">
      
      {/* Interior de la pantalla (Screen) */}
      <div className="relative bg-[#F8FAFC] rounded-[2.5rem] sm:rounded-[3rem] w-full h-full overflow-hidden flex flex-col text-slate-900">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 inset-x-0 h-6 sm:h-7 flex justify-center z-20">
          <div className="w-24 sm:w-28 h-5 sm:h-6 bg-slate-900 rounded-b-2xl sm:rounded-b-3xl relative">
            {/* Lente simulado */}
            <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-800 border border-slate-700/50"></div>
          </div>
        </div>

        {/* --- SCROLLABLE FEED VISUAL --- */}
        <div className="flex-1 overflow-hidden pb-16 pt-10 flex flex-col bg-white">
          
          {/* Status Bar simulada (Hora + Batería) */}
          <div className="absolute top-1 left-6 text-[10px] font-bold text-slate-800 z-20">9:41</div>
          
          {/* Header App */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent" style={{ fontFamily: 'Comic Sans MS, cursive' }}>FeedYou</span>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Bell className="w-3 h-3 text-slate-600" />
              </div>
            </div>
          </div>

          {/* ----- POST COMPONENT ----- */}
          <div className="flex-1 flex flex-col mt-4">
            
            {/* Post Header */}
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 p-[2px]">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" className="w-full h-full object-cover p-1" alt="avatar" onError={(e) => e.target.style.display='none'} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none mb-1">Cine_Indie</span>
                  <span className="text-[10px] text-slate-500 font-medium">Recomendado para ti</span>
                </div>
              </div>
              <MoreHorizontal className="text-slate-400 w-5 h-5" />
            </div>

            {/* Post Media */}
            <div className="w-full h-[220px] sm:h-[260px] px-4 mt-2">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 shadow-inner flex flex-col justify-end p-5 relative overflow-hidden group">
                 {/* Decorative blur inside post */}
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-2xl rounded-full"></div>
                 
                 <div className="relative z-10">
                   <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-tight mb-1 drop-shadow-md">Estrenos del Mes</h3>
                   <p className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-md">Películas que hacen match con tus gustos.</p>
                 </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-5 py-3 flex items-center justify-between mt-1">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500 drop-shadow-sm transition-transform hover:scale-110" />
                <MessageCircle className="w-6 h-6 text-slate-700 hover:text-indigo-500 transition-colors" />
              </div>
              <Bookmark className="w-5 h-5 text-slate-700" />
            </div>

            {/* Post Content */}
            <div className="px-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
               <span className="font-bold text-slate-900 mr-2">@Cine_Indie</span> 
               ¡Prepara las palomitas! 🍿 Basado en lo que viste ayer, esta selección te va a encantar...
               <span className="text-indigo-500 font-medium ml-1 cursor-pointer">ver más</span>
            </div>
            
          </div>
        </div>

        {/* --- BOTTOM TAB BAR --- */}
        <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100/50 flex items-center justify-around px-2 sm:px-6 rounded-b-[2.5rem] sm:rounded-b-[3rem] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          
          <div className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-slate-900 drop-shadow-sm" />
            <div className="w-1 h-1 rounded-full bg-slate-900"></div>
          </div>
          
          <Search className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 transform -translate-y-4 hover:scale-105 transition-transform cursor-pointer border-4 border-white">
            <span className="text-white text-3xl font-light leading-none mb-1">+</span>
          </div>
          
          <Heart className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
          
          <User className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
          
        </div>

      </div>
    </div>
  );
}
