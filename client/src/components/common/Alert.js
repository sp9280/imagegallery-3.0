import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const Alert = ({ message, type = "info", onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const config = {
    success: {
      icon: CheckCircleIcon,
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      iconColor: "text-emerald-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    },
    error: {
      icon: ExclamationTriangleIcon,
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/50",
      text: "text-rose-700 dark:text-rose-400",
      iconColor: "text-rose-500",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800/50",
      text: "text-amber-700 dark:text-amber-400",
      iconColor: "text-amber-500",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    },
    info: {
      icon: InformationCircleIcon,
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200 dark:border-cyan-800/50",
      text: "text-cyan-700 dark:text-cyan-400",
      iconColor: "text-cyan-500",
      glow: "shadow-[0_0_20px_rgba(0,245,212,0.15)]",
    },
  };

  const cfg = config[type] || config.info;
  const Icon = cfg.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.glow} backdrop-blur-xl animate-fade-in-down relative`}
    >
      <Icon className={`w-5 h-5 ${cfg.iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${cfg.text} leading-relaxed`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
          aria-label="Close alert"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
