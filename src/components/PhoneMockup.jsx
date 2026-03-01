import React from "react";

export default function PhoneMockup() {
  return (
    <div className="relative">
      {/* Fondo rotado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-[3rem] transform rotate-3"></div>

      {/* Contenedor principal */}
      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem] p-8">

        {/* Floating Icons */}
        <div className="absolute top-8 left-12 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg"></div>
        </div>

        <div className="absolute top-20 right-16 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-pink-300 rounded-full"></div>
        </div>

        <div className="absolute top-12 right-32 flex gap-2">
          <div className="w-8 h-8 bg-cyan-300 rounded-full"></div>
          <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
        </div>

        <div className="absolute top-32 left-8 w-14 h-14 bg-pink-200 rounded-2xl shadow-lg"></div>
        <div className="absolute top-44 left-16 w-12 h-12 bg-orange-300 rounded-2xl shadow-lg"></div>

        <div className="absolute top-20 right-4 w-14 h-14 bg-purple-400 rounded-2xl shadow-lg"></div>
        <div className="absolute top-56 right-8 w-12 h-12 bg-orange-300 rounded-xl shadow-lg"></div>

        {/* Phone */}
        <div className="relative mx-auto w-64 bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden">

            {/* Notch */}
            <div className="bg-black h-6 w-32 mx-auto rounded-b-2xl"></div>

            {/* Screen */}
            <div className="p-4 pb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-pink-300 rounded-full"></div>
                <span className="text-sm font-medium">@user1</span>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 mb-3">
                <p className="text-xs mb-2">Estrenos de este mes</p>
                <div className="bg-gray-300 rounded-lg h-24 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                </div>
              </div>

              <div className="flex gap-4 justify-center text-gray-600 mb-4">
                <button className="text-red-500 text-2xl">♥</button>
                <button className="text-gray-400 text-2xl">★</button>
                <button className="text-gray-400 text-2xl">⋯</button>
              </div>

              {/* Progress */}
              <div className="bg-gradient-to-r from-pink-300 to-pink-400 h-10 rounded-full flex items-center px-4 mb-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-around">
                <button className="w-10 h-10 bg-green-300 rounded-xl"></button>
                <button className="w-10 h-10 bg-cyan-300 rounded-full text-white text-xl flex items-center justify-center">
                  +
                </button>
                <button className="w-10 h-10 bg-cyan-300 rounded-full"></button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Hearts */}
        <div className="absolute bottom-32 right-8 text-red-400 text-4xl">♥</div>
        <div className="absolute bottom-24 right-16 text-red-400 text-3xl">♥</div>
        <div className="absolute bottom-16 right-12 text-red-500 text-5xl">♥</div>

        {/* Accent Bar */}
        <div className="absolute top-48 right-24 w-32 h-8 bg-cyan-300 rounded-full"></div>
      </div>
    </div>
  );
}
