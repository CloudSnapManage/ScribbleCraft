"use client";

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); // Wait half a second before finishing
          return 100;
        }
        return prev + 1.5; // Controls the speed of the loading bar
      });
    }, 25); 

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center transition-opacity duration-500">
        <h1 className="text-5xl font-bold tracking-tight mb-4" style={{fontFamily: "'Shadows Into Light', cursive"}}>ScribbleCraft</h1>
        <div className="w-1/2 max-w-sm bg-muted rounded-full h-2.5 overflow-hidden">
            <div className="loading-bar h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
  );
};

export default LoadingScreen;
