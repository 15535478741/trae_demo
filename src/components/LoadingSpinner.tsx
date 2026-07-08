import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const { theme } = useAppStore();
  const currentTheme = themes[theme];
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: currentTheme.primary }}
        />
        <div 
          className={`absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin`}
          style={{ borderTopColor: currentTheme.primaryLight }}
        />
      </div>
      {text && (
        <p className={`text-white/70 ${textSizes[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}