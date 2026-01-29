import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatusModal } from './components/StatusModal';
import { TRAINING_WEEKS, MAX_FILE_SIZE_MB, GOOGLE_SCRIPT_URL } from './constants';
import { TraineeSubmission, UploadStatus, FeedbackResponse } from './types';
import { UploadCloud, File as FileIcon, User, Calendar, X, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [submission, setSubmission] = useState<TraineeSubmission>({
    name: '',
    weekId: '',
    files: [],
  });
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      const validFiles: File[] = [];

      newFiles.forEach(file => {
        // 1. Size Check
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`'${file.name}' 파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과하여 제외되었습니다.`);
          return;
        }

        // 2. Duplicate Check
        const isDuplicate = submission.files.some(existing => 
          existing.name === file.name && 
          existing.size === file.size && 
          existing.lastModified === file.lastModified
        ) || validFiles.some(added => 
          added.name === file.name && 
          added.size === file.size && 
          added.lastModified === file.lastModified
        );

        if (isDuplicate) {
          alert(`'${file.name}'은(는) 이미 목록에 추가된 파일입니다.`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setSubmission((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
      }
      
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files) as File[];
      const validFiles: File[] = [];

      newFiles.forEach(file => {
        // 1. Size Check
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
           alert(`'${file.name}' 파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과하여 제외되었습니다.`);
           return;
        }

        // 2. Duplicate Check
        const isDuplicate = submission.files.some(existing => 
          existing.name === file.name && 
          existing.size === file.size && 
          existing.lastModified === file.lastModified
        ) || validFiles.some(added => 
          added.name === file.name && 
          added.size === file.size && 
          added.lastModified === file.lastModified
        );

        if (isDuplicate) {
          alert(`'${file.name}'은(는) 이미 목록에 추가된 파일입니다.`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setSubmission((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSubmission((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission.name || !submission.weekId || submission.files.length === 0) return;

    if (!GOOGLE_SCRIPT_URL) {
      alert("관리자 설정 오류: Google Script URL이 설정되지 않았습니다. constants.ts 파일을 확인해주세요.");
      return;
    }

    setStatus(UploadStatus.UPLOADING);

    try {
      const weekLabel = TRAINING_WEEKS.find(w => w.id === submission.weekId)?.label || 'Unknown';
      
      for (const file of submission.files) {
        const base64Data = await fileToBase64(file);
        
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            name: submission.name,
            week: weekLabel,
            fileName: file.name,
            mimeType: file.type,
            fileData: base64Data
          })
        });
      }

      const fileCount = submission.files.length;
      const fileNames = submission.files.map(f => f.name).join(', ');
      
      setFeedback({
        message: fileCount === 1 ? fileNames : `${submission.files[0].name} 외 ${fileCount - 1}건`,
        encouragement: "수고하셨습니다! 훈련을 통해 더욱 성장하시길 축복합니다."
      });
      setStatus(UploadStatus.SUCCESS);

    } catch (error) {
      console.error("Upload Failed:", error);
      setStatus(UploadStatus.ERROR);
    }
  };

  const resetFormFull = () => {
    setSubmission({ name: '', weekId: '', files: [] });
    setStatus(UploadStatus.IDLE);
    setFeedback(null);
  };

  const resetFilesOnly = () => {
    setSubmission(prev => ({ ...prev, files: [] }));
    setStatus(UploadStatus.IDLE);
    setFeedback(null);
  };

  const isFormValid = submission.name.length > 0 && submission.weekId.length > 0 && submission.files.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Header />

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-6 md:p-10">
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-bold text-gray-900">과제 제출하기</h2>
             <p className="text-lg text-slate-600 mt-3 font-medium">이름과 주차를 선택 후 파일을 올려주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Identity */}
            <div className="space-y-3">
              <label className="block text-xl font-bold text-gray-900">
                1. 성함이 어떻게 되시나요?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-600">
                  <User size={28} />
                </div>
                <input
                  type="text"
                  value={submission.name}
                  onChange={(e) => setSubmission({ ...submission, name: e.target.value })}
                  placeholder="예: 홍길동"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-xl text-gray-900 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Step 2: Context */}
            <div className="space-y-3">
              <label className="block text-xl font-bold text-gray-900">
                2. 몇 주차 과제인가요?
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-600">
                  <Calendar size={28} />
                </div>
                <select
                  value={submission.weekId}
                  onChange={(e) => setSubmission({ ...submission, weekId: e.target.value })}
                  className="w-full pl-14 pr-10 py-5 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-xl text-gray-900 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="" disabled className="text-slate-400">눌러서 주차를 선택하세요</option>
                  {TRAINING_WEEKS.map((week) => (
                    <option key={week.id} value={week.id} className="py-2">
                      {week.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3: File */}
            <div className="space-y-3">
              <label className="block text-xl font-bold text-gray-900">
                3. 과제 파일을 올려주세요
                <span className="block text-base font-normal text-slate-500 mt-1">여러 개를 한 번에 올리셔도 됩니다.</span>
              </label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative group cursor-pointer"
              >
                <div className="border-3 border-dashed border-slate-400 rounded-3xl p-10 text-center transition-all bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-500">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,.pdf,.doc,.docx,.hwp"
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-5 bg-white rounded-full shadow-md text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud size={48} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-slate-800">
                        여기를 눌러서 파일을 선택하세요
                      </p>
                      <p className="text-base text-slate-500">
                        사진, PDF, 한글, 워드 파일 가능
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File List */}
              {submission.files.length > 0 && (
                <div className="space-y-3 mt-6">
                  <p className="text-lg font-bold text-blue-800 px-1">선택된 파일 목록 ({submission.files.length}개):</p>
                  {submission.files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm shrink-0">
                          <FileIcon size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-slate-600 font-medium">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-3 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-xl transition-colors shadow-sm"
                        aria-label="파일 삭제"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Configuration Warning */}
            {!GOOGLE_SCRIPT_URL && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start space-x-4">
                <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={32} />
                <div className="text-base text-amber-900">
                  <p className="font-bold text-lg mb-2">관리자 설정 필요</p>
                  <p>
                    구글 드라이브 주소가 설정되지 않았습니다. 관리자에게 문의하세요.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || !GOOGLE_SCRIPT_URL}
                className={`w-full py-5 rounded-2xl font-bold text-2xl shadow-xl transition-all duration-300 ${
                  isFormValid && GOOGLE_SCRIPT_URL
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {submission.files.length > 0 ? `${submission.files.length}개 파일 제출하기` : '과제 제출하기'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <StatusModal
        status={status}
        feedback={feedback}
        files={submission.files}
        onReset={resetFormFull}
        onContinue={resetFilesOnly}
      />
    </div>
  );
};

export default App;