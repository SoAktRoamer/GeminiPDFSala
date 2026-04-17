import React from 'react';
import { Icon } from './Icon';

export default function Hero() {
  return (
    <div id="top" className="w-full flex-col items-center justify-center pt-16 pb-16 px-4 text-center">
      <h1 className="text-4xl md:text-[3.5rem] font-bold text-white tracking-tight mb-6 max-w-4xl mx-auto tutorial-welcome leading-tight">
        Every tool you need to work with PDFs in one place
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        All are 100% FREE and easy to use! Merge, split, compress, convert, and even chat with your PDFs using AI.
      </p>
    </div>
  );
}
