import React, { useState, useEffect } from 'react'; // Import useEffect
import CreateNewScreenPopup from '../components/CreateNewScreenPopup';
import StandbyCard from '../components/StandbyCard';
import { PlusCircle, Tv, MonitorPlay } from 'lucide-react';
// Import storage functions including clear and the stored type
import { getStandbyScreens, addStandbyScreen, StoredStandbyScreen, clearStandbyScreens } from '../storage/standbyStorage';

// Interface for the data submitted from the popup (matching CreateNewScreenPopup)
interface StandbyScreenSubmitDetails {
  title: string; // Add title back
  welcomeMessage: string;
  countdownDuration: { hours: number; minutes: number; seconds: number; };
  category: string;
  backgroundColor: string;
}

const HomeScreen: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Initialize state from localStorage
  const [screens, setScreens] = useState<StoredStandbyScreen[]>(() => getStandbyScreens());

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle submission - type matches the popup's onSubmit prop
  const handleSubmit = (details: StandbyScreenSubmitDetails) => {
    const updatedScreens = addStandbyScreen(details);
    setScreens(updatedScreens); // Update state with the new list from storage
    console.log('New Standby Screen added:', details);
    handleClosePopup(); // Close popup after submission
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Tv size={28} className="text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">StandBy Screens</h1>
            </div>
            {/* Button in header */}
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={handleOpenPopup}
            >
              <PlusCircle size={18} className="mr-2 -ml-1" />
              Create New Screen
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Standby Screens</h2>
          {/* Render based on the 'screens' state */}
          {screens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Map over the 'screens' state */}
              {screens.map((screen) => (
                <StandbyCard
                  key={screen.id}
                  id={screen.id}
                  title={screen.title} // Add title prop back
                  countdownDuration={screen.countdownDuration}
                  category={screen.category}
                  backgroundColor={screen.backgroundColor}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <MonitorPlay size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No standby screens yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first screen.</p>
              <div className="mt-6">
                 {/* Button in empty state */}
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleOpenPopup}
                >
                  <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create New Screen
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Conditionally render the popup */}
      {isPopupOpen && <CreateNewScreenPopup onClose={handleClosePopup} onSubmit={handleSubmit} />}
    </>
  );
};

export default HomeScreen;
