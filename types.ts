export enum UploadStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface TraineeSubmission {
  name: string;
  weekId: string;
  files: File[];
}

export interface WeekOption {
  id: string;
  label: string;
  topic?: string;
}

export interface FeedbackResponse {
  message: string;
  encouragement: string;
}