import { useState } from 'react';
import { X, ChevronRight, Shield, FileText, Link2, Image, ArrowRight } from 'lucide-react';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

export function OnboardingGuide() {
  const { theme } = useAppStore();
  const currentTheme = themes[theme];
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Shield,
      title: '欢迎使用资料核验',
      description: '我们帮助您快速辨别网络信息的真实性，让每一条资料都值得信赖',
      color: currentTheme.primary,
    },
    {
      icon: FileText,
      title: '文本检测',
      description: '输入任意文本内容，系统会自动分析其准确性和可信度',
      color: '#3b82f6',
    },
    {
      icon: Link2,
      title: '链接验证',
      description: '粘贴网页链接，我们会评估来源可靠性并给出权威评分',
      color: '#10b981',
    },
    {
      icon: Image,
      title: '图片分析',
      description: '上传图片进行格式检测、元数据验证和编辑痕迹识别',
      color: '#f59e0b',
    },
    {
      icon: ArrowRight,
      title: '开始检测',
      description: '选择您需要的检测类型，开始验证资料的真实性吧！',
      color: currentTheme.primary,
    },
  ];

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${steps[currentStep].color}20` }}
          >
            {(() => {
              const IconComponent = steps[currentStep].icon;
              return <IconComponent className="w-8 h-8" style={{ color: steps[currentStep].color }} />;
            })()}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
          {steps[currentStep].title}
        </h2>
        
        <p className="text-gray-500 text-center mb-6">
          {steps[currentStep].description}
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8' 
                  : ''
              }`}
              style={{ 
                backgroundColor: index === currentStep ? steps[currentStep].color : '#e5e7eb'
              }}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: steps[currentStep].color }}
          >
            {currentStep === steps.length - 1 ? '开始使用' : '下一步'}
            <ChevronRight className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
