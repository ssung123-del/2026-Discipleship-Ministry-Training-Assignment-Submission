export enum UploadStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface TraineeSubmission {
  name: string;
  files: File[];
}

export interface WeekOption {
  id: string;
  label: string;
  topic?: string;
  assignmentItems?: string[];
  memoryVerse?: {
    reference: string;
    text?: string;
  };
  section?: string; // Grouping (e.g., 1권, 2권)
  startDate?: string; // YYYY-MM-DD format for date comparison
}

export interface FeedbackResponse {
  message: string;
  encouragement: string;
}
