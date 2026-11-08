// Advanced Image Editor Component
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiRotateCw, FiZoomIn, FiZoomOut, FiDownload } from 'react-icons/fi';
import { modalVariants, overlayVariants } from '../../utils/animations';

const ImageEditor = ({ imageUrl, onClose, onSave }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const canvasRef = useRef(null);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleSave = () => {
    // In a real implementation, you would apply these transformations
    // and save the edited image
    const edits = { rotation, zoom, brightness, contrast, saturation };
    onSave && onSave(edits);
    onClose();
  };

  const filterStyle = {
    transform: `rotate(${rotation}deg) scale(${zoom})`,
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transition: 'all 0.3s ease'
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500 to-primary-600">
            <h2 className="text-2xl font-bold text-white">Image Editor</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <FiX size={24} className="text-white" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Image Preview */}
            <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Edit preview"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
                  style={filterStyle}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-80 p-6 space-y-6 bg-white dark:bg-gray-800">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Adjustments</h3>

                {/* Brightness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    className="w-full accent-primary-500"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(e.target.value)}
                    className="w-full accent-primary-500"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🌈 Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(e.target.value)}
                    className="w-full accent-primary-500"
                  />
                </div>

                {/* Zoom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom: {Math.round(zoom * 100)}%
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="flex-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FiZoomOut className="mx-auto" />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="flex-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FiZoomIn className="mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Rotation */}
                <button
                  onClick={handleRotate}
                  className="w-full p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FiRotateCw /> Rotate 90°
                </button>

                {/* Reset */}
                <button
                  onClick={() => {
                    setRotation(0);
                    setZoom(1);
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                  }}
                  className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  🔄 Reset All
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={onClose}
                  className="w-full p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageEditor;