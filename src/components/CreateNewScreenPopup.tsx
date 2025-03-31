import React, { useState } from 'react';

interface CountdownDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

interface StandbyScreenDetails {
  title: string;
  countdownDuration: CountdownDuration;
  category: string;
  backgroundColor: string;
}

interface CreateNewScreenPopupProps {
  onClose: () => void;
  onSubmit: (details: StandbyScreenDetails) => void;
}

const CreateNewScreenPopup: React.FC<CreateNewScreenPopupProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(15); // Default to 15 minutes
  const [seconds, setSeconds] = useState(0);
  const [category, setCategory] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#4f46e5'); // Default to indigo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      countdownDuration: {
        hours: Number(hours) || 0,
        minutes: Number(minutes) || 0,
        seconds: Number(seconds) || 0,
      },
      category,
      backgroundColor,
    });
    // No need to call onClose here, the parent component's handleSubmit will do it
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Standby Screen</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Countdown Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Countdown Duration</label>
            <div className="mt-1 grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="hours" className="block text-xs text-gray-500">Hours</label>
                <input
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value, 10))}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="minutes" className="block text-xs text-gray-500">Minutes</label>
                <input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="seconds" className="block text-xs text-gray-500">Seconds</label>
                <input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Background Color */}
          <div className="mb-4">
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Background Color</label>
            <div className="mt-1 flex items-center">
              <input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-10 w-10 p-0 border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="ml-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="#rrggbb"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewScreenPopup;
