import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BlurCardProps {
  children: React.ReactNode;
  className?: string;
}

export const BlurCard: React.FC<BlurCardProps> = ({ children, className }) => (
  <div className={cn(
    "glass rounded-2xl p-6 shadow-lg shadow-black/5 animate-fade-in",
    className
  )}>
    {children}
  </div>
);

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const variants = {
    primary: "apple-button-primary",
    secondary: "apple-button-secondary",
    danger: "apple-button bg-apple-red text-white hover:bg-apple-red/90 shadow-sm",
  };

  return (
    <button
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

interface ProgressBarProps {
  progress: number;
  label?: string;
  status?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, status }) => (
  <div className="w-full space-y-2">
    <div className="flex justify-between text-sm font-medium text-apple-gray-400">
      <span>{label}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="h-2 w-full bg-apple-gray-200 dark:bg-apple-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-apple-blue transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    {status && <p className="text-xs text-apple-gray-300 italic">{status}</p>}
  </div>
);
