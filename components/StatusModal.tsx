import React from 'react';
import { UploadStatus, FeedbackResponse } from '../types';
import { Loader2, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

interface StatusModalProps {
  status: UploadStatus;
  feedback: FeedbackResponse | null;
  files?: File[];
  onReset: () => void; // Completely reset (Close)
  onContinue: () => void; // Keep info, clear files (Upload More)
}

export const StatusModal: React.FC<StatusModalProps> = ({ status, feedback, files, onReset, onContinue }) => {
  if (status === UploadStatus.IDLE) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 relative overflow-hidden border-2 border-slate-100">
        
        {/* Loading State */}
        {(status === UploadStatus.UPLOADING || status === UploadStatus.ANALYZING) && (
          <div className="text-center py-10">
            <div className="relative mx-auto w-24 h-24 mb-8">
               <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <Loader2 className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              파일을 올리고 있습니다
            </h3>
            <p className="text-xl text-slate-600">화면을 닫지 말고 잠시만 기다려주세요.</p>
          </div>
        )}

        {/* Success State */}
        {status === UploadStatus.SUCCESS && feedback && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">제출 완료!</h3>
             <p className="text-xl text-slate-600 mb-8 font-medium">총 <span className="text-blue-600 font-bold">{files?.length || 1}개</span>의 파일이 잘 전송되었습니다.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border-2 border-slate-200 text-left">
              {/* File List */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {files && files.length > 0 ? (
                  files.map((file, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <FileText className="text-blue-600 shrink-0" size={24} />
                      <span className="font-bold text-gray-800 truncate text-lg flex-1">{file.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <FileText className="text-blue-600 shrink-0" size={24} />
                    <span className="font-bold text-gray-800 truncate text-lg">{feedback.message}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-700 text-lg mt-4 pt-4 border-t-2 border-slate-200 font-medium leading-relaxed">
                "{feedback.encouragement}"
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={onContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl text-xl transition-all shadow-lg transform active:scale-95"
              >
                추가 업로드
              </button>
              
              <button
                onClick={onReset}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-5 rounded-2xl text-xl transition-colors border-2 border-slate-200"
              >
                완료
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === UploadStatus.ERROR && (
          <div className="text-center py-6">
             <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">문제가 생겼습니다</h3>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              오류가 발생했습니다.<br/>잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={onReset}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-5 rounded-2xl text-xl transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};