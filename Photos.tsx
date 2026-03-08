import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Photos() {
  const [selectedImage, setSelectedImage] = useState(0);

  const photos = [
    'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2161459/pexels-photo-2161459.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3842150/pexels-photo-3842150.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2469504/pexels-photo-2469504.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3407550/pexels-photo-3407550.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2651857/pexels-photo-2651857.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 bg-gray-50">
        <h1 className="text-lg font-semibold">Photos</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={photos[selectedImage]}
            alt="Selected"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm text-gray-600">
            {selectedImage + 1} of {photos.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <h2 className="text-sm font-semibold mb-3">Gallery</h2>
        <div className="grid grid-cols-4 gap-3 auto-rows-max">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === idx ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
