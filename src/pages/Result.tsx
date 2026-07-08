import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, HelpCircle, ArrowLeft, ExternalLink, FileText, Link2, Clock, AlertTriangle, BookOpen, Search, Scale, Brain, Calendar, Calculator, Image, Camera, Shield, Fingerprint, File } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { themes } from '@/types';
import type { TextAnalysisDetails, ImageAnalysisDetails } from '@/utils/api';

export function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResult, checkResults, theme } = useAppStore();
  const [result, setResult] = useState<typeof currentResult & { analysisDetails?: TextAnalysisDetails; imageAnalysis?: ImageAnalysisDetails }>(currentResult as any);
  
  const currentTheme = themes[theme];
  
  useEffect(() => {
    if (!currentResult && id) {
      const found = checkResults.find(r => r.id === id);
      if (found) {
        setResult(found as any);
      }
    }
  }, [currentResult, checkResults, id]);
  
  if (!result) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">未找到检测结果</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 rounded-full font-medium"
            style={{ backgroundColor: currentTheme.primary, color: 'white' }}
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }
  
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'true':
        return {
          icon: CheckCircle,
          text: '信息属实',
          color: '#22c55e',
          bgColor: '#dcfce7',
          description: '经过多方验证，该信息真实可靠',
        };
      case 'false':
        return {
          icon: XCircle,
          text: '信息不实',
          color: '#ef4444',
          bgColor: '#fee2e2',
          description: '该信息存在虚假内容，请注意辨别',
        };
      default:
        return {
          icon: HelpCircle,
          text: '待验证',
          color: '#eab308',
          bgColor: '#fef9c3',
          description: '信息真实性尚未完全确认，请谨慎参考',
        };
    }
  };
  
  const verdictConfig = getVerdictConfig();
  const VerdictIcon = verdictConfig.icon;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const analysisDetails = result.analysisDetails;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="pt-24 pb-8 px-4"
        style={{ backgroundColor: currentTheme.primary }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          
          <div 
            className="flex items-center gap-4 p-6 rounded-2xl"
            style={{ backgroundColor: verdictConfig.bgColor }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${verdictConfig.color}20` }}
            >
              <VerdictIcon className="w-10 h-10" style={{ color: verdictConfig.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: verdictConfig.color }}>
                {verdictConfig.text}
              </h1>
              <p className="text-gray-600 mt-1">{verdictConfig.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">检测概览</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-xl bg-blue-50">
                <div className="text-4xl font-bold" style={{ color: currentTheme.primary }}>
                  {result.accuracy_score}%
                </div>
                <div className="text-gray-500 text-sm mt-1">内容准确性</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-50">
                <div className="text-4xl font-bold text-green-600">
                  {result.source_reliability}%
                </div>
                <div className="text-gray-500 text-sm mt-1">来源可靠性</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">置信度</span>
                <span className="font-bold" style={{ color: currentTheme.primary }}>
                  {result.confidence}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${result.confidence}%`,
                    background: `linear-gradient(90deg, ${currentTheme.primaryLight}, ${currentTheme.primary})`
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">检测内容</h2>
            <div className="flex items-center gap-2 mb-3">
              {result.content_type === 'text' ? (
                <FileText className="w-5 h-5 text-gray-400" />
              ) : result.content_type === 'image' ? (
                <Image className="w-5 h-5 text-gray-400" />
              ) : result.content_type === 'document' ? (
                <File className="w-5 h-5 text-gray-400" />
              ) : (
                <Link2 className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm text-gray-400">
                {result.content_type === 'text' ? '文本内容' : result.content_type === 'image' ? '图片内容' : result.content_type === 'document' ? '文档内容' : '网址链接'}
              </span>
            </div>
            {result.content_type === 'image' && result.imageData ? (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={result.imageData}
                  alt="检测图片"
                  className="w-full max-h-96 object-contain bg-gray-50"
                />
              </div>
            ) : result.content_type === 'document' ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">文档已上传并分析</p>
                <p className="text-gray-400 text-sm mt-1">支持 PDF、Word、TXT、RTF 格式</p>
              </div>
            ) : (
              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl break-all">
                {result.content}
              </p>
            )}
          </div>
          
          {analysisDetails && analysisDetails.matchedFacts && analysisDetails.matchedFacts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">事实匹配</h2>
              </div>
              <div className="space-y-3">
                {analysisDetails.matchedFacts.map((fact, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl ${fact.type === 'true' ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {fact.type === 'true' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${fact.type === 'true' ? 'text-green-700' : 'text-red-700'}`}>
                        {fact.type === 'true' ? '已验证事实' : '不实信息'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white text-gray-500 ml-auto">
                        {fact.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white text-gray-500">
                        可信度 {fact.sourceReliability}%
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{fact.description}</p>
                    <p className="text-gray-400 text-xs mt-2">来源：{fact.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.matchedSources && analysisDetails.matchedSources.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">可信来源引用</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisDetails.matchedSources.map((source, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50"
                  >
                    <span className="text-blue-700 font-medium">{source.name}</span>
                    <span className="text-xs text-blue-500">{source.description}</span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-white text-blue-600">
                      {source.reliability}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.similarityInfo && analysisDetails.similarityInfo.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">文本相似度对比</h2>
              </div>
              <div className="space-y-3">
                {analysisDetails.similarityInfo.map((item, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{item.source}</span>
                      <div className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-gray-400" />
                        <span className={`text-sm font-bold ${item.similarity >= 70 ? 'text-green-600' : item.similarity >= 50 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {item.similarity}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.logicalAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">逻辑一致性检测</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisDetails.logicalAnalysis.consistent ? 'bg-green-100' : 'bg-red-100'}`}>
                  {analysisDetails.logicalAnalysis.consistent ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${analysisDetails.logicalAnalysis.consistent ? 'text-green-700' : 'text-red-700'}`}>
                    {analysisDetails.logicalAnalysis.consistent ? '逻辑一致' : '存在逻辑问题'}
                  </p>
                  {analysisDetails.logicalAnalysis.issues.length > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      {analysisDetails.logicalAnalysis.issues.join('；')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.dateAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">日期有效性检测</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisDetails.dateAnalysis.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                  {analysisDetails.dateAnalysis.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${analysisDetails.dateAnalysis.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {analysisDetails.dateAnalysis.valid ? '日期有效' : '日期存在问题'}
                  </p>
                  {analysisDetails.dateAnalysis.issues.length > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      {analysisDetails.dateAnalysis.issues.join('；')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.numberAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">数据合理性检测</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisDetails.numberAnalysis.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                  {analysisDetails.numberAnalysis.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${analysisDetails.numberAnalysis.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {analysisDetails.numberAnalysis.valid ? '数据合理' : '数据存在问题'}
                  </p>
                  {analysisDetails.numberAnalysis.issues.length > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      {analysisDetails.numberAnalysis.issues.join('；')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {analysisDetails && analysisDetails.aiDetection && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h2 className="text-lg font-semibold text-gray-800">AI内容检测</h2>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${analysisDetails.aiDetection.isAI ? 'bg-purple-100' : 'bg-green-100'}`}>
                  <span className="text-2xl">
                    {analysisDetails.aiDetection.isAI ? '⚠️' : '✅'}
                  </span>
                </div>
                <div>
                  <p className={`text-xl font-bold ${analysisDetails.aiDetection.isAI ? 'text-purple-600' : 'text-green-600'}`}>
                    {analysisDetails.aiDetection.isAI ? '可能为AI生成' : '人工创作特征'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    AI检测置信度：{Math.round(analysisDetails.aiDetection.confidence)}%
                  </p>
                </div>
              </div>
              
              {analysisDetails.aiDetection.isAI && analysisDetails.aiDetection.indicators && analysisDetails.aiDetection.indicators.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-purple-700 font-medium text-sm mb-2">检测到的AI特征：</p>
                  <ul className="text-purple-600 text-sm space-y-1">
                    {analysisDetails.aiDetection.indicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!analysisDetails.aiDetection.isAI && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-green-700 text-sm">文本具有明显的人工创作特征，语言表达自然真实。</p>
                </div>
              )}
            </div>
          )}
          
          {result.imageAnalysis && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5" style={{ color: currentTheme.primary }} />
                <h2 className="text-lg font-semibold text-gray-800">图片验证分析</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700 font-medium">格式检测</span>
                  </div>
                  <p className={`text-lg font-bold ${result.imageAnalysis.formatValid ? 'text-green-600' : 'text-red-600'}`}>
                    {result.imageAnalysis.formatValid ? '✓ 有效' : '✗ 无效'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">格式类型: {result.imageAnalysis.formatType}</p>
                </div>
                
                <div className="p-4 rounded-xl bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">尺寸检测</span>
                  </div>
                  <p className={`text-lg font-bold ${result.imageAnalysis.sizeValid ? 'text-green-600' : 'text-red-600'}`}>
                    {result.imageAnalysis.sizeValid ? '✓ 合理' : '✗ 异常'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{result.imageAnalysis.width} × {result.imageAnalysis.height} 像素</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">EXIF元数据</span>
                  </div>
                  <span className={`text-sm font-medium ${result.imageAnalysis.hasExif ? 'text-green-600' : 'text-gray-400'}`}>
                    {result.imageAnalysis.hasExif ? '✓ 存在' : '✗ 缺失'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">数字签名</span>
                  </div>
                  <span className={`text-sm font-medium ${result.imageAnalysis.hasDigitalSignature ? 'text-green-600' : 'text-gray-400'}`}>
                    {result.imageAnalysis.hasDigitalSignature ? '✓ 存在' : '✗ 缺失'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">水印标记</span>
                  </div>
                  <span className={`text-sm font-medium ${result.imageAnalysis.hasWatermark ? 'text-green-600' : 'text-gray-400'}`}>
                    {result.imageAnalysis.hasWatermark ? '✓ 存在' : '✗ 缺失'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">编辑痕迹</span>
                  </div>
                  <span className={`text-sm font-medium ${result.imageAnalysis.hasEditingTraces ? 'text-red-600' : 'text-green-600'}`}>
                    {result.imageAnalysis.hasEditingTraces ? '✗ 检测到' : '✓ 未检测到'}
                  </span>
                </div>
              </div>
              
              {result.imageAnalysis.hasEditingTraces && result.imageAnalysis.editingTraces && result.imageAnalysis.editingTraces.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-red-700 font-medium text-sm mb-2">检测到的编辑痕迹：</p>
                  <ul className="text-red-600 text-sm space-y-1">
                    {result.imageAnalysis.editingTraces.map((trace, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {trace}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.imageAnalysis.watermarkInfo && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-blue-700 text-sm">{result.imageAnalysis.watermarkInfo}</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">文件大小: {result.imageAnalysis.fileSize} KB</p>
                <p className="text-sm text-gray-500 mt-1">压缩状态: {result.imageAnalysis.isCompressed ? '已压缩' : '未压缩'}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">详细分析</h2>
            <p className="text-gray-600 leading-relaxed">
              {result.analysis}
            </p>
          </div>
          
          {result.sources && result.sources.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">来源验证</h2>
              <div className="space-y-4">
                {result.sources.map((source, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${currentTheme.primary}20` }}
                    >
                      <ExternalLink className="w-5 h-5" style={{ color: currentTheme.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline truncate"
                        >
                          {source.url}
                        </a>
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded-full ml-2 whitespace-nowrap"
                          style={{ 
                            backgroundColor: source.reliability >= 70 ? '#dcfce7' : source.reliability >= 40 ? '#fef9c3' : '#fee2e2',
                            color: source.reliability >= 70 ? '#166534' : source.reliability >= 40 ? '#854d0e' : '#991b1b'
                          }}
                        >
                          {source.reliability}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{source.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">检测时间</span>
            </div>
            <p className="text-gray-600">{formatDate(result.created_at)}</p>
          </div>
          
          {result.verdict === 'false' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">警示</p>
                <p className="text-red-600 text-sm mt-1">
                  该信息被判定为不实，请不要轻信和传播此类信息
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.primaryLight}, ${currentTheme.primary})`
            }}
          >
            继续检测
          </button>
        </div>
      </div>
    </div>
  );
}