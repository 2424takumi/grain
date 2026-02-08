export interface DailyEntry {
  id: string;
  entryDate: string;  // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;

  journalText?: string;

  originalPhotoPath: string;
  thumbnailPhotoPath: string;
  photoFileSize: number;
  photoWidth: number;
  photoHeight: number;

  latitude?: number;
  longitude?: number;
  photoCaptureDate?: string;

  isDeleted: boolean;
  deletedAt?: string;
}

export interface AppSettings {
  id: string;

  isDarkModeEnabled: boolean;
  selectedAppIcon: string;
  isPremiumUser: boolean;

  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  lastStreakUpdateDate?: string;

  hasCompletedOnboarding: boolean;
  onboardingVersion: number;
}

export interface CreateEntryInput {
  entryDate: string;
  photoUri: string;
  journalText?: string;
  latitude?: number;
  longitude?: number;
}
