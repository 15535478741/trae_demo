import { useState } from 'react';
import { History, Trash2, AlertCircle, X, Check } from 'lucide-react';
import type { CheckResult } from '@/types';
import { ResultCard } from './ResultCard';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

interface HistoryListProps {
  results: CheckResult[];
}

export function HistoryList({ results }: HistoryListProps) {
  const { theme, removeCheckResult, clearAllResults } = useAppStore();
  const currentTheme = themes[theme];
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      removeCheckResult(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };
  
  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAllResults();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };
  
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">暂无检测记录</p>
        <p className="text-gray-300 text-sm mt-2">开始检测您的第一条信息吧</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" style={{ color: currentTheme.primary }} />
          <h2 className="text-xl font-bold text-gray-800">检测历史</h2>
          <span className="text-sm text-gray-400">({results.length})</span>
        </div>
        <button
          onClick={handleClearAll}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showClearConfirm
              ? 'bg-red-500 text-white'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          {showClearConfirm ? (
            <>
              <Check className="w-4 h-4" />
              确认清空？
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              清空全部
            </>
          )}
        </button>
      </div>
      
      <div className="grid gap-4">
        {results.map((result) => (
          <div key={result.id}>
            <ResultCard 
              result={result} 
              onDelete={handleDelete} 
            />
            {deleteConfirmId === result.id && (
              <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 rounded-xl animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-600 text-sm flex-1">确定要删除这条记录吗？</span>
                <button
                  onClick={() => {
                    removeCheckResult(result.id);
                    setDeleteConfirmId(null);
                  }}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  确认删除
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}