'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const Preloader = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // GSAP Entrance
    const tl = gsap.timeline();
    
    tl.to('.preloader-bar', {
      width: '100%',
      duration: 2.5,
      ease: 'power4.inOut',
    });

    tl.to('.preloader-content', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      delay: 0.2
    });

    tl.to('.preloader-container', {
      yPercent: -100,
      duration: 1,
      ease: 'expo.inOut',
      onComplete: () => {
        document.body.style.overflow = 'auto';
      }
    });

    // Safety Timeout: Force reveal after 5 seconds if assets hang
    const safetyTimer = setTimeout(() => {
      setPercent(100);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="preloader-container fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="preloader-content flex flex-col items-center gap-12">
        {/* Animated Logo / Brand */}
        <div className="flex flex-col items-center group">
          <span className="text-5xl md:text-7xl font-display tracking-tighter text-white leading-none uppercase italic font-bold">
            PROXY<span className="text-primary">CAR</span>
          </span>
          <div className="h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700 mt-2"></div>
        </div>

        {/* Loading Progress */}
        <div className="flex flex-col items-center gap-6 w-[200px] md:w-[300px]">
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <div className="preloader-bar absolute top-0 left-0 h-full w-0 bg-primary shadow-[0_0_20px_rgba(255,45,45,0.8)]"></div>
          </div>
          <div className="flex justify-between w-full">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold italic">Loading Excellence</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold italic">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
        <span className="text-[25vw] font-display font-bold uppercase tracking-tighter italic">EST. 2024</span>
      </div>
    </div>
  );
};

export default Preloader;
