import React, { useState, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { StatusModal } from './components/StatusModal';
import { TRAINING_WEEKS, MAX_FILE_SIZE_MB, GOOGLE_SCRIPT_URL } from './constants';
import { TraineeSubmission, UploadStatus, FeedbackResponse } from './types';
import { UploadCloud, File as FileIcon, User, Calendar, X, AlertTriangle, Clock } from 'lucide-react';

// Recommended encouragement messages list
const ENCOURAGEMENT_MESSAGES = [
  "바쁜 일상 속에서도 훈련의 자리를 지키시는 모습이 정말 아름답습니다.",
  "성실한 훈련이 믿음의 단단한 뿌리가 될 것입니다. 끝까지 응원합니다!",
  "오늘도 주님과 동행하며 승리하는 하루 보내시길 기도합니다.",
  "제출하신 과제를 통해 하나님을 더 깊이 알아가시길 소망합니다.",
  "수고 많으셨습니다! 남은 한 주도 주님의 은혜 안에 평안하세요.",
  "작은 순종이 모여 큰 기적을 이룹니다. 훈련생님을 축복합니다!"
];

const App: React.FC = () => {
  const [submission, setSubmission] = useState<TraineeSubmission>({
    name: '',
    weekId: '',
    files: [],
  });
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Use refs to track progress across async operations
  const progressMapRef = useRef<number[]>([]);

  // --- Calculate Current Week ---
  const currentWeekLabel = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Find the latest week that has started
    const validWeeks = TRAINING_WEEKS.filter(w => w.startDate);
    const currentWeek = [...validWeeks].reverse().find(w => w.startDate! <= todayStr);
    
    return currentWeek ? currentWeek.label.split('(')[0].trim() : null;
  }, []);

  // --- Image Compression Utility ---
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      
      reader.onerror = (e) => reject(e);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIMENSION = 1600;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              if (compressedFile.size > file.size) {
                resolve(file);
              } else {
                resolve(compressedFile);
              }
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.7
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      const validFiles: File[] = [];

      newFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`'${file.name}' 파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과하여 제외되었습니다.`);
          return;
        }

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
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
           alert(`'${file.name}' 파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과하여 제외되었습니다.`);
           return;
        }

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

  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length);
    return ENCOURAGEMENT_MESSAGES[randomIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission.name || !submission.weekId || submission.files.length === 0) return;

    if (!GOOGLE_SCRIPT_URL) {
      alert("관리자 설정 오류: Google Script URL이 설정되지 않았습니다. constants.ts 파일을 확인해주세요.");
      return;
    }

    setStatus(UploadStatus.UPLOADING);
    setProgress(0);
    
    // Initialize progress tracking
    progressMapRef.current = new Array(submission.files.length).fill(0);
    const totalOriginalSize = submission.files.reduce((acc, f) => acc + f.size, 0);

    const updateWeightedProgress = () => {
      const totalUploaded = progressMapRef.current.reduce((acc, fraction, idx) => {
        return acc + (fraction * submission.files[idx].size);
      }, 0);
      const percentage = totalOriginalSize > 0 
        ? Math.min(100, Math.round((totalUploaded / totalOriginalSize) * 100))
        : 0;
      setProgress(percentage);
    };

    try {
      const weekLabel = TRAINING_WEEKS.find(w => w.id === submission.weekId)?.label || 'Unknown';
      
      const uploadSingleFile = async (originalFile: File, index: number) => {
        // 1. Compress Image
        const fileToUpload = await compressImage(originalFile);
        
        // 2. Convert to Base64
        const base64Data = await fileToBase64(fileToUpload);
        
        // --- Progress Simulation Start ---
        const SIMULATED_SPEED_BYTES_PER_MS = 500 * 1024 / 1000; // 0.5 MB/s
        const estimatedDurationMs = Math.max(1500, fileToUpload.size / SIMULATED_SPEED_BYTES_PER_MS);
        const startTime = Date.now();
        
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const simulatedFraction = Math.min(0.9, elapsed / estimatedDurationMs);
          
          progressMapRef.current[index] = simulatedFraction;
          updateWeightedProgress();
        }, 200);

        try {
          // 3. Upload (fetch no-cors)
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              name: submission.name,
              week: weekLabel,
              fileName: originalFile.name,
              mimeType: fileToUpload.type,
              fileData: base64Data
            })
          });
        } finally {
          clearInterval(progressInterval);
          progressMapRef.current[index] = 1.0;
          updateWeightedProgress();
        }
      };

      // 1. Upload the FIRST file sequentially to ensure folder creation.
      if (submission.files.length > 0) {
        await uploadSingleFile(submission.files[0], 0);
      }

      // 2. Upload ALL remaining files in PARALLEL.
      if (submission.files.length > 1) {
        const remainingFiles = submission.files.slice(1);
        await Promise.all(remainingFiles.map((file, i) => uploadSingleFile(file, i + 1)));
      }

      const fileCount = submission.files.length;
      const fileNames = submission.files.map(f => f.name).join(', ');
      
      setFeedback({
        message: fileCount === 1 ? fileNames : `${submission.files[0].name} 외 ${fileCount - 1}건`,
        encouragement: getRandomEncouragement()
      });
      setStatus(UploadStatus.SUCCESS);
      setProgress(100);

    } catch (error) {
      console.error("Upload Failed:", error);
      setStatus(UploadStatus.ERROR);
    }
  };

  const resetFormFull = () => {
    setSubmission({ name: '', weekId: '', files: [] });
    setStatus(UploadStatus.IDLE);
    setFeedback(null);
    setProgress(0);
  };

  const resetFilesOnly = () => {
    setSubmission(prev => ({ ...prev, files: [] }));
    setStatus(UploadStatus.IDLE);
    setFeedback(null);
    setProgress(0);
  };

  const weeksBySection = TRAINING_WEEKS.reduce((acc, week) => {
    const section = week.section || '기타';
    if (!acc[section]) acc[section] = [];
    acc[section].push(week);
    return acc;
  }, {} as Record<string, typeof TRAINING_WEEKS>);

  const isFormValid = submission.name.length > 0 && submission.weekId.length > 0 && submission.files.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Header />

      <main className="max-w-lg mx-auto px-4 mt-6">
        
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-5 md:p-6">
          <div className="mb-6 text-center">
             <h2 className="text-xl font-bold text-gray-900">과제 제출하기</h2>
             <p className="text-sm text-slate-600 mt-1 font-medium">이름과 주차를 선택 후 파일을 올려주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Identity */}
            <div className="space-y-1">
              <label className="block text-base font-bold text-gray-900">
                1. 성함이 어떻게 되시나요?
                <span className="block text-xs font-normal text-slate-500 mt-1">직분 없이 이름만 기록해주세요</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={submission.name}
                  onChange={(e) => setSubmission({ ...submission, name: e.target.value })}
                  placeholder="예: 홍길동"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-base text-gray-900 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Step 2: Context */}
            <div className="space-y-1">
              <label className="block text-base font-bold text-gray-900">
                2. 몇 주차 과제인가요?
              </label>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-center text-blue-800 mb-1.5">
                <Clock size={16} className="mr-2 text-blue-600 shrink-0" />
                <span className="font-medium text-sm">
                   {currentWeekLabel ? (
                     <>이번 주는 <span className="font-bold">{currentWeekLabel}</span> 기간입니다.</>
                   ) : (
                     <span>현재는 훈련 기간이 아닙니다.</span>
                   )}
                </span>
              </div>

              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                  <Calendar size={20} />
                </div>
                <select
                  value={submission.weekId}
                  onChange={(e) => setSubmission({ ...submission, weekId: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-base text-gray-900 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="" disabled className="text-slate-400">눌러서 주차를 선택하세요</option>
                  
                  {Object.entries(weeksBySection).map(([section, weeks]) => (
                    <optgroup key={section} label={section} className="font-bold text-slate-900 bg-slate-50">
                      {weeks.map((week) => (
                        <option key={week.id} value={week.id} className="py-2 bg-white font-normal text-gray-900">
                          {week.label} {week.topic ? `- ${week.topic}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3: File */}
            <div className="space-y-1">
              <label className="block text-base font-bold text-gray-900">
                3. 과제 파일을 올려주세요
                <span className="block text-xs font-normal text-slate-500 mt-1">
                  D형큐티, 설교나눔, 독후감 등을 올려주세요. (여러 파일 가능)
                </span>
              </label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative group cursor-pointer"
              >
                <div className="border-3 border-dashed border-slate-400 rounded-xl p-6 text-center transition-all bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-500">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,.pdf,.doc,.docx,.hwp"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white rounded-full shadow-md text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud size={32} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-base font-bold text-slate-800">
                        여기를 눌러서 파일을 선택하세요
                      </p>
                      <p className="text-xs text-slate-500">
                        사진, PDF, 한글, 워드 파일 가능
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File List */}
              {submission.files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-bold text-blue-800 px-1">선택된 파일 목록 ({submission.files.length}개):</p>
                  {submission.files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm shrink-0">
                          <FileIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-600 font-medium">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg transition-colors shadow-sm"
                        aria-label="파일 삭제"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Configuration Warning */}
            {!GOOGLE_SCRIPT_URL && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-1">관리자 설정 필요</p>
                  <p>
                    구글 드라이브 주소가 설정되지 않았습니다. 관리자에게 문의하세요.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || !GOOGLE_SCRIPT_URL}
                className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
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
        progress={progress}
        onReset={resetFormFull}
        onContinue={resetFilesOnly}
      />
    </div>
  );
};

export default App;