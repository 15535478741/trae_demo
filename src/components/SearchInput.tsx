import { useState, useRef } from 'react';
import { FileText, Link2, Image, Upload, X, File } from 'lucide-react';
import { themes } from '@/types';
import { useAppStore } from '@/store/useStore';

interface SearchInputProps {
  onSubmit: (content: string, type: 'text' | 'url' | 'image' | 'document') => void;
  disabled?: boolean;
}

export function SearchInput({ onSubmit, disabled }: SearchInputProps) {
  const [content, setContent] = useState('');
  const [activeType, setActiveType] = useState<'text' | 'url' | 'image' | 'document'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [documentContent, setDocumentContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useAppStore();
  
  const currentTheme = themes[theme];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = content.trim() || imagePreview || documentContent;
    if (hasContent && !disabled) {
      onSubmit(imagePreview || documentContent || content.trim(), activeType);
    }
  };
  
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };
  
  const autoDetectType = () => {
    if (isUrl(content)) {
      setActiveType('url');
    } else {
      setActiveType('text');
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('请上传有效的图片文件（JPEG、PNG、GIF、BMP、WebP）');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(extension)) {
        alert('请上传有效的文档文件（PDF、Word、TXT、RTF）');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('文档大小不能超过10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (extension === '.txt' || extension === '.rtf') {
          setDocumentContent(result);
        } else {
          setDocumentContent(result.slice(0, 5000));
        }
        setDocumentName(file.name);
      };
      
      if (extension === '.txt' || extension === '.rtf') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };
  
  const removeFile = () => {
    setImagePreview(null);
    setImageName('');
    setDocumentName('');
    setDocumentContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleTypeChange = (type: 'text' | 'url' | 'image' | 'document') => {
    setActiveType(type);
    if (type !== 'image' && type !== 'document') {
      removeFile();
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() => handleTypeChange('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeType === 'text'
              ? 'text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          style={{ backgroundColor: activeType === 'text' ? currentTheme.primary : undefined }}
        >
          <FileText className="w-4 h-4" />
          <span>文本检测</span>
        </button>
        <button
          onClick={() => handleTypeChange('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeType === 'url'
              ? 'text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          style={{ backgroundColor: activeType === 'url' ? currentTheme.primary : undefined }}
        >
          <Link2 className="w-4 h-4" />
          <span>链接检测</span>
        </button>
        <button
          onClick={() => handleTypeChange('image')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeType === 'image'
              ? 'text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          style={{ backgroundColor: activeType === 'image' ? currentTheme.primary : undefined }}
        >
          <Image className="w-4 h-4" />
          <span>图片检测</span>
        </button>
        <button
          onClick={() => handleTypeChange('document')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeType === 'document'
              ? 'text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          style={{ backgroundColor: activeType === 'document' ? currentTheme.primary : undefined }}
        >
          <File className="w-4 h-4" />
          <span>文档检测</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {activeType === 'image' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                imagePreview
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/15'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {imageName}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">点击上传图片</p>
                  <p className="text-white/40 text-xs mt-1">支持 JPEG、PNG、GIF、BMP、WebP 格式</p>
                  <p className="text-white/40 text-xs">最大 10MB</p>
                </div>
              )}
            </div>
          ) : activeType === 'document' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                documentName
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/15'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {documentName ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <File className="w-16 h-16 text-white/50 mx-auto mb-3" />
                    <p className="text-white/80 text-sm font-medium">{documentName}</p>
                    <p className="text-white/40 text-xs mt-1">已上传，点击更换</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">点击上传文档</p>
                  <p className="text-white/40 text-xs mt-1">支持 PDF、Word、TXT、RTF 格式</p>
                  <p className="text-white/40 text-xs">最大 10MB</p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                autoDetectType();
              }}
              placeholder={activeType === 'text' 
                ? '请输入要检测的文本内容...' 
                : '请输入要检测的网址链接...'
              }
              disabled={disabled}
              className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-white/20 bg-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              style={{ 
                borderColor: disabled ? 'rgba(255,255,255,0.1)' : undefined,
                backgroundColor: disabled ? 'rgba(255,255,255,0.05)' : undefined
              }}
            />
          )}
          {activeType !== 'image' && activeType !== 'document' && (
            <div className="absolute bottom-3 right-3 text-white/40 text-sm">
              {content.length} / 5000
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={activeType === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt,.rtf'}
            onChange={activeType === 'image' ? handleImageUpload : handleDocumentUpload}
            className="hidden"
          />
        </div>
        
        <button
          type="submit"
          disabled={!((content.trim() || imagePreview || documentContent) && !disabled)}
          className="w-full mt-4 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primaryLight}, ${currentTheme.primary})`,
            boxShadow: `0 4px 20px ${currentTheme.primary}40`
          }}
        >
          {disabled ? '检测中...' : '开始检测'}
        </button>
      </form>
    </div>
  );
}
