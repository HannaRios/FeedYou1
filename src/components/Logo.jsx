import React from 'react';

export default function Logo({ size = 'md', showText = false }) {
  const sizes = {
    sm: { dimension: 32, text: 'text-lg' },
    md: { dimension: 48, text: 'text-2xl' },
    lg: { dimension: 64, text: 'text-3xl' }
  };

  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <img 
        src="/logo.png" 
        alt="FeedYou Logo" 
        width={sizes[size].dimension}
        height={sizes[size].dimension}
        className="transition-transform group-hover:scale-110"
      />
      {showText && (
        <span 
          className={`${sizes[size].text} font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent`}
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          FeedYou
        </span>
      )}
    </div>
  );
}