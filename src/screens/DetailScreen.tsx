import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick'; // Re-import Slider
import { ArrowLeft, Maximize, Minimize, AlertCircle } from 'lucide-react';
import { getStandbyScreenById, StoredStandbyScreen } from '../storage/standbyStorage';
import NewsCard from '../components/NewsCard'; // Re-import NewsCard

// Helper function to format time
const formatTime = (timeInSeconds: number): string => {
  if (timeInSeconds <= 0) return '00:00:00';
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const DetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { screenId } = useParams<{ screenId: string }>(); // Get screenId from URL params
  const [screenData, setScreenData] = useState<StoredStandbyScreen | null | undefined>(undefined); // undefined: loading, null: not found
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  // Effect to fetch screen data based on screenId
  useEffect(() => {
    if (screenId) {
      const data = getStandbyScreenById(screenId);
      setScreenData(data); // Set to data or null if not found
      if (data) {
        // Calculate initial time left in seconds
        const initialSeconds = (data.countdownDuration.hours * 3600) +
                               (data.countdownDuration.minutes * 60) +
                               data.countdownDuration.seconds;
        setTimeLeft(initialSeconds);
      } else {
        setTimeLeft(0); // Reset timer if screen not found
      }
    } else {
      setScreenData(null); // No ID provided, set to not found
      setTimeLeft(0);
    }
  }, [screenId]);

  // Effect for the countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return; // Don't start interval if time is already 0

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    // Cleanup interval on component unmount or when timer reaches 0
    return () => clearInterval(timerId);
  }, [timeLeft]); // Rerun effect only when timeLeft changes

  // Fullscreen handling
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Loading state
  if (screenData === undefined) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Loading screen data...</div>;
  }

  // Not found state
  if (!screenData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <AlertCircle size={48} className="mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Screen Not Found</h1>
        <p className="mb-4">The requested standby screen could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Main content when data is loaded
  return (
    // Restore original main div without dynamic background
    <div className="flex flex-col h-screen relative">
      {/* Back Button (remains the same) */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
        title="Back to Home"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Full Screen Button (remains the same) */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
        title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>

      {/* Top Section (35%) - Restore original structure */}
      <div className="basis-0 grow-[7] flex flex-col items-center justify-center bg-gray-100 p-4 pt-16">
        {/* Welcome Message / Title */}
        <div className="mb-10 text-center">
          {/* Display fetched title */}
          <h1 className="text-3xl font-semibold text-gray-800">{screenData.title || 'Session Starting Soon'}</h1>
           {/* Optionally display category */}
           {screenData.category && (
            <p className="text-lg mt-2 text-gray-600">{screenData.category}</p>
          )}
        </div>
        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-xl mb-3 text-gray-600">We will start in</p>
          <div className="text-8xl font-bold tabular-nums text-gray-900">
            {/* Use timeLeft state derived from fetched data */}
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Bottom Section - Carousel (65%) - Restore original structure */}
      <div className="basis-0 grow-[13] bg-gray-200 p-4 overflow-hidden">
        <NewsCarousel /> {/* Restore NewsCarousel */}
      </div>
    </div>
  );
};

// Re-add NewsCarousel component and related types/data
// Define the type for a single news item
interface SampleNewsItem {
  id: number;
  title: string;
  content: { type: 'text'; value: string } | { type: 'image'; value: string }; // Use the specific union type
  date: string;
  tags: string[];
}

// Sample News Data (replace with actual data source later)
const sampleNews: SampleNewsItem[] = [ // Explicitly type the array
  { id: 1, title: "New Feature Rollout", content: { type: 'text', value: "We're excited to announce the rollout of feature X, enhancing productivity across the board." }, date: "March 29, 2025", tags: ["Product", "Update"] },
  { id: 2, title: "Q1 Earnings Report", content: { type: 'image', value: "https://via.placeholder.com/400x200.png?text=Q1+Results+Graph" }, date: "March 28, 2025", tags: ["Finance", "Company"] },
  { id: 3, title: "Upcoming Maintenance", content: { type: 'text', value: "Scheduled maintenance on Sunday, April 2nd, from 2 AM to 4 AM UTC. Expect brief downtime." }, date: "March 27, 2025", tags: ["System", "Alert"] },
  { id: 4, title: "Welcome New Hires!", content: { type: 'text', value: "Join us in welcoming Alice, Bob, and Charlie to the team!" }, date: "March 26, 2025", tags: ["People", "HR"] },
];

// Carousel Component
const NewsCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        // Enable autoplay
    autoplaySpeed: 5000,   // Change slide every 5 seconds
    pauseOnHover: true,    // Pause autoplay on hover
    arrows: false,         // Hide default arrows (optional)
    className: "h-full",   // Ensure slider takes full height of its container
  };

  return (
    <div className="h-full w-[90%] mx-auto"> {/* Use 90% width and center */}
      <Slider {...settings} className="h-full">
        {sampleNews.map((news) => (
          <div key={news.id} className="p-2 h-full"> {/* Added padding around each card */}
            <NewsCard
              title={news.title}
              content={news.content}
              date={news.date}
              tags={news.tags}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DetailScreen;
