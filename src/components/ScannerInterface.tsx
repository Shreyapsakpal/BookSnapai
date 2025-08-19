import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, Zap, CheckCircle, Play, Tag } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

const ScannerInterface: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockScanResult = {
    title: "Introduction to Quantum Physics",
    pages: 15,
    ocrText: "Chapter 1: The Fundamentals of Quantum Mechanics\n\nQuantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles...",
    aiEnhancements: {
      summary: "This chapter introduces the basic principles of quantum mechanics, covering wave-particle duality, uncertainty principles, and mathematical foundations.",
      keyPoints: [
        "Wave-particle duality is fundamental to quantum mechanics",
        "Heisenberg's uncertainty principle limits simultaneous measurement accuracy",
        "Quantum states are described using wave functions",
        "Observable quantities correspond to mathematical operators"
      ],
      relatedVideos: [
        {
          title: "Quantum Mechanics Explained Simply",
          url: "#",
          thumbnail: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
          duration: "15:32"
        },
        {
          title: "Double Slit Experiment",
          url: "#",
          thumbnail: "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
          duration: "8:45"
        }
      ],
      concepts: ["quantum mechanics", "wave-particle duality", "uncertainty principle", "wave functions"],
      difficulty: "medium" as const
    }
  };

  const handleCameraCapture = async () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScanResult(mockScanResult);
      setIsScanning(false);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        setScanResult(mockScanResult);
        setIsScanning(false);
      }, 2000);
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
              <span>Image processing complete</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Running OCR analysis...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-current rounded-full" />
              <span>Generating AI insights...</span>
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
              <span>{scanResult.pages} pages scanned</span>
              <span>98% accuracy</span>
            </div>
          </Card>

          {/* AI Insights */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {scanResult.aiEnhancements.summary}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Points</h4>
                <ul className="space-y-1">
                  {scanResult.aiEnhancements.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {scanResult.aiEnhancements.concepts.map((concept: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Related Videos */}
        <Card variant="default" className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Play className="w-6 h-6 text-red-600 mr-3" />
            Related Learning Videos
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {scanResult.aiEnhancements.relatedVideos.map((video: any, index: number) => (
              <div key={index} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {video.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Options */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Save to Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Add this scan to your personal library
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Add Tags
              </Button>
              <Button>
                Save Book
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Book Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Capture book pages and transform them into intelligent, searchable content
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Camera Capture */}
        <Card variant="glass" className="p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Camera Capture
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Use your device camera to scan book pages in real-time
          </p>
          <Button onClick={handleCameraCapture} size="lg" className="w-full">
            Start Camera
          </Button>
        </Card>

        {/* File Upload */}
        <Card variant="glass" className="p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Upload Images
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upload photos of book pages from your device
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Card>
      </div>

      {/* Features */}
      <Card variant="default" className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          AI-Powered Features
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Smart OCR</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Advanced optical character recognition with 99% accuracy
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Automatic summaries, key points, and concept extraction
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Related Content</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Find relevant videos, articles, and learning materials
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScannerInterface;