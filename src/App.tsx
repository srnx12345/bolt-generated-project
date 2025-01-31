import React, { useState, useRef } from 'react'
    import { Moon, Sun, Upload, Download, CheckCircle } from 'lucide-react'
    import './index.css'

    const App: React.FC = () => {
      const [isDarkMode, setIsDarkMode] = useState(false)
      const [uploadedImage, setUploadedImage] = useState<string | null>(null)
      const [processedImage, setProcessedImage] = useState<string | null>(null)
      const [isProcessing, setIsProcessing] = useState(false)
      const [isDownloadable, setIsDownloadable] = useState(false)
      const imageInputRef = useRef<HTMLInputElement>(null)

      const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode)
      }

      const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setUploadedImage(reader.result as string)
            setProcessedImage(null)
            setIsDownloadable(false)
          }
          reader.readAsDataURL(file)
        }
      }

      const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
      }

      const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setUploadedImage(reader.result as string)
            setProcessedImage(null)
            setIsDownloadable(false)
          }
          reader.readAsDataURL(file)
        }
      }

      const handleRemoveBackground = async () => {
        if (!uploadedImage) return
        setIsProcessing(true)
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setProcessedImage(
            'https://images.unsplash.com/photo-1682687220091-8878b7522887?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          )
          setIsDownloadable(true)
        } catch (error) {
          console.error('Error removing background:', error)
        } finally {
          setIsProcessing(false)
        }
      }

      const handleDownloadImage = () => {
        if (!processedImage) return
        const link = document.createElement('a')
        link.href = processedImage
        link.download = 'background-removed-image.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      const handleUploadButtonClick = () => {
        imageInputRef.current?.click()
      }

      return (
        <div
          className={`min-h-screen flex items-center justify-center p-4 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } transition-colors duration-300`}
        >
          <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl p-8 relative">
            <button
              onClick={handleThemeToggle}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <h1 className="text-2xl font-bold mb-6 text-center">
              AI Background Remover
            </h1>
            <p className="text-center mb-6 text-gray-600">
              Remove image backgrounds easily and instantly with AI. No design
              skills required! Just upload your image and get results in one
              click!
            </p>
            <div
              className="border-2 border-dashed border-gray-400 rounded-lg p-6 mb-6 text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleUploadButtonClick}
            >
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-h-48 max-w-full mx-auto rounded-md mb-4"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      setProcessedImage(null)
                      setIsDownloadable(false)
                    }}
                    className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-500">
                    Drag & drop an image here or click to upload
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                ref={imageInputRef}
              />
            </div>
            {uploadedImage && !processedImage && (
              <button
                onClick={handleRemoveBackground}
                disabled={isProcessing}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 w-full ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? 'Removing...' : 'Remove Background'}
              </button>
            )}
            {processedImage && (
              <div className="mt-6">
                <div className="relative">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="max-h-48 max-w-full mx-auto rounded-md mb-4"
                  />
                  {isDownloadable && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={handleDownloadImage}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center items-center mt-4">
                  <CheckCircle
                    size={24}
                    className="text-green-500 mr-2"
                  />
                  <p className="text-gray-600">
                    Background removed successfully!
                  </p>
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sample 1"
                className="h-16 w-16 rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={() =>
                  setUploadedImage(
                    'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  )
                }
              />
              <img
                src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sample 2"
                className="h-16 w-16 rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={() =>
                  setUploadedImage(
                    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  )
                }
              />
              <img
                src="https://images.unsplash.com/photo-1534528741702-a0c49e587007?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sample 3"
                className="h-16 w-16 rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={() =>
                  setUploadedImage(
                    'https://images.unsplash.com/photo-1534528741702-a0c49e587007?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  )
                }
              />
            </div>
          </div>
        </div>
      )
    }

    export default App
