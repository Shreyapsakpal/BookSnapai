import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, Zap, CheckCircle, Play, Tag } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { api } from '../utils/api';

const ScannerInterface: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = async () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await api<{ bookId: string; page: any }>('/api/scan/upload', {
        method: 'POST',
        body: form,
        headers: {}
      });
      setScanResult({
        title: `Uploaded page ${data.page.pageNumber}`,
        pages: 1,
        ocrText: data.page.ocrText || 'OCR not processed yet',
        aiEnhancements: {
          summary: data.page.aiSummary || 'Summary not available yet',
          keyPoints: [],
          relatedVideos: [],
          concepts: [],
          difficulty: data.page.difficulty || 'medium'
        },
        imageUrl: data.page.imageUrl
      });
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isScanning) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Scanning in Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we process your book pages...
          </p>
        </div>

        <Card variant="glass" className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Uploading file...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Saving to library...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (scanResult) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scan Results
          </h1>
          <Button onClick={() => setScanResult(null)} variant="outline">
            New Scan
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* OCR Results */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Extracted Text
              </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {scanResult.ocrText}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{scanResult.pages} page uploaded</span>
              <span>Pending OCR</span>
            </div>
          </Card>

          {/* Image Preview */}
          <Card variant="elevated" className="p-6">
            {scanResult.imageUrl ? (
              <img src={scanResult.imageUrl} alt="Uploaded page" className="w-full rounded" />
            ) : null}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Scan Book Pages
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload a photo or PDF page to add it to your library
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Use Camera
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Capture a page using your device camera
            </p>
            <Button onClick={handleCameraCapture}>
              <Camera className="w-4 h-4 mr-2" />
              Open Camera / Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload File
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Upload an image or a PDF page from your device
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScannerInterface;