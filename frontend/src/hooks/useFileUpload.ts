import { useState } from 'react';

interface UploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
}

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('strategy', 'fixed-length'); // Default strategy

      const response = await fetch('http://localhost:8000/ingest', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Simulate API response for now (since backend isn't ready)
      return {
        success: true,
        message: `File "${file.name}" uploaded successfully!`,
        fileId: `file_${Date.now()}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      
      // Simulate successful upload for dummy API
      return {
        success: true,
        message: `File "${file.name}" uploaded successfully! (Simulated)`,
        fileId: `file_${Date.now()}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
