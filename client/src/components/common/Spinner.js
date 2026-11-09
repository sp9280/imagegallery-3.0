// client/src/components/common/Spinner.js
import React from "react";

const Spinner = ({ label = "Loading...", size = "md" }) => {
  const sizeClass = size === "lg" ? "w-12 h-12" : size === "sm" ? "w-7 h-7" : "w-10 h-10";

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Dual-ring glow spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <div className={`absolute ${sizeClass} rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin shadow-[0_0_20px_rgba(0,245,212,0.3)]`} />
        {/* Inner pulsing dot */}
        <div className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 animate-ping opacity-75" />
      </div>
      {/* Label */}
      <p className="text-xs font-bold tracking-wider text-cyan-500 dark:text-cyan-400 animate-pulse uppercase">
        {label}
      </p>
    </div>
  );
};

export default Spinner;
