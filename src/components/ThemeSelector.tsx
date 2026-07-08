import { themes, type ThemeName } from '@/types';
import { useAppStore } from '@/store/useStore';

interface ThemeSelectorProps {
  onChange?: (theme: ThemeName) => void;
}

export function ThemeSelector({ onChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useAppStore();
  
  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    if (onChange) {
      onChange(newTheme);
    }
  };
  
  const themeNames: Record<ThemeName, string> = {
    blue: '科技蓝',
    green: '自然绿',
    purple: '优雅紫',
    orange: '活力橙',
    pink: '温馨粉',
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">主题颜色</h3>
      <div className="grid grid-cols-5 gap-3">
        {(Object.keys(themes) as ThemeName[]).map((themeName) => {
          const themeConfig = themes[themeName];
          const isActive = theme === themeName;
          
          return (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'ring-2 ring-offset-2 shadow-lg scale-110' 
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: themeConfig.primary,
                boxShadow: isActive ? `0 0 0 2px ${themeConfig.primary}, 0 0 0 4px white` : undefined,
              }}
              title={themeNames[themeName]}
            >
              {isActive && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
                </div>
              )}
              <span className="text-white text-xs font-medium">{themeNames[themeName]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}