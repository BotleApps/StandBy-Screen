import React from 'react';
import StandbyCard from '../components/StandbyCard';
import { PlusCircle, Tv, MonitorPlay } from 'lucide-react'; // Added MonitorPlay

// Placeholder data - replace with actual data fetching later
const standbyScreensData = [
  { id: '1', title: 'Weekly Team Sync', countdownDuration: { hours: 0, minutes: 15, seconds: 0 }, category: 'Meeting', backgroundColor: '#4f46e5' }, // Indigo
  { id: '2', title: 'Project Alpha Kickoff', countdownDuration: { hours: 1, minutes: 0, seconds: 0 }, category: 'Workshop', backgroundColor: '#059669' }, // Emerald
  { id: '3', title: 'Client Demo - Q3 Features', countdownDuration: { hours: 0, minutes: 45, seconds: 0 }, category: 'Presentation', backgroundColor: '#db2777' }, // Pink
  { id: '4', title: 'All Hands Meeting', countdownDuration: { hours: 0, minutes: 5, seconds: 30 }, category: 'Company', backgroundColor: '#d97706' }, // Amber
  { id: '5', title: 'Design Review Session', countdownDuration: { hours: 0, minutes: 30, seconds: 0 }, category: 'Review', backgroundColor: '#6d28d9' }, // Violet
];

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Tv size={28} className="text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">StandBy Screens</h1>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            onClick={() => console.log('Create new screen')} // Replace with actual action/navigation
          >
            <PlusCircle size={18} className="mr-2 -ml-1" />
            Create New Screen
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Standby Screens</h2>
        {standbyScreensData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {standbyScreensData.map((screen) => (
              <StandbyCard
                key={screen.id}
                id={screen.id}
                title={screen.title}
                countdownDuration={screen.countdownDuration}
                category={screen.category}
                backgroundColor={screen.backgroundColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MonitorPlay size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No standby screens yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first screen.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => console.log('Create new screen from empty state')} // Replace with actual action/navigation
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create New Screen
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
