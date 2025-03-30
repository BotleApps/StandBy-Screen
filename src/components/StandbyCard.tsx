import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { MonitorPlay, Clock, Settings, Trash2 } from 'lucide-react';

interface CountdownDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

interface StandbyCardProps {
  id: string;
  title: string;
  countdownDuration: CountdownDuration; // Duration for the countdown timer
  category: string; // Category for the standby screen
  backgroundColor: string; // Background color for the card placeholder
}

const StandbyCard: React.FC<StandbyCardProps> = ({ id, title, countdownDuration, category, backgroundColor }) => {
  const navigate = useNavigate(); // Get navigate function

  // Format duration for display (optional, could just show category)
  const formatDuration = (duration: CountdownDuration | undefined) => {
    // Add check for undefined or incomplete duration object
    if (!duration || typeof duration.hours === 'undefined' || typeof duration.minutes === 'undefined' || typeof duration.seconds === 'undefined') {
      return 'N/A'; // Return a default string if duration is invalid
    }
    const parts = [];
    if (duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
    if (duration.seconds > 0 || parts.length === 0) parts.push(`${duration.seconds}s`); // Show seconds if others are 0 or always
    return parts.join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col">
      {/* Use backgroundColor for the placeholder */}
      <div
        className="w-full h-32 flex items-center justify-center"
        style={{ backgroundColor: backgroundColor || '#e0e7ff' }} // Default to a light indigo if no color provided
      >
        <MonitorPlay size={48} className="text-white opacity-75" /> {/* Adjusted icon color for better contrast */}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mr-2">{title}</h3>
          {/* Display Category */}
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{category}</span>
        </div>
        {/* Display duration in two lines */}
        <div className="mb-4"> {/* Container for the two lines */}
          <div className="flex items-center text-sm text-gray-500 mb-1"> {/* Line 1: Icon and Label */}
            <Clock size={16} className="mr-1.5 flex-shrink-0" />
            <span>Duration</span>
          </div>
          <div className="text-lg font-semibold text-gray-800 truncate"> {/* Line 2: Value (Larger Font) */}
            {formatDuration(countdownDuration)}
          </div>
        </div>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
           <button
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-200"
            title="View Screen"
            onClick={() => navigate('/detail')} // Navigate to detail screen
          >
            <MonitorPlay size={16} className="mr-1" /> View
          </button>
          <div className="flex space-x-2">
             <button
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="Settings"
              onClick={() => console.log(`Settings for ${id}`)} // Replace with actual action
            >
              <Settings size={18} />
            </button>
             <button
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Delete"
              onClick={() => console.log(`Delete screen ${id}`)} // Replace with actual action
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandbyCard;
