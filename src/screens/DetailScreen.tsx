import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { ArrowLeft, Maximize, Minimize, AlertCircle, RefreshCw } from 'lucide-react'; // Add RefreshCw
import { getStandbyScreenById, StoredStandbyScreen, StoredManualNewsItem } from '../storage/standbyStorage';
import NewsCard from '../components/NewsCard';

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
  const { screenId } = useParams<{ screenId: string }>();
  const [screenData, setScreenData] = useState<StoredStandbyScreen | null | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [isHoveringTimer, setIsHoveringTimer] = useState<boolean>(false); // State for hover

  // Effect to fetch screen data
  useEffect(() => {
    if (screenId) {
      const data = getStandbyScreenById(screenId);
      setScreenData(data);
      if (data) {
        const initialSeconds = (data.countdownDuration.hours * 3600) +
                               (data.countdownDuration.minutes * 60) +
                               data.countdownDuration.seconds;
        setTimeLeft(initialSeconds);
      } else {
        setTimeLeft(0);
      }
    } else {
      setScreenData(null);
      setTimeLeft(0);
    }
  }, [screenId]);

  // Effect for the countdown timer
  useEffect(() => {
    // No need to check timeLeft > 0 here, interval clears when it hits 0 anyway
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId); // Clear interval when reaching 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval
    return () => clearInterval(timerId);
  }, [timeLeft]); // Re-run effect if timeLeft is reset externally

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

  // Function to reset timer
  const handleResetTimer = (seconds: number) => {
    setTimeLeft(seconds);
  };

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

  // Main content
  return (
    <div className="flex flex-col h-screen relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
        title="Back to Home"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Full Screen Button */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
        title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>

      {/* Top Section */}
      <div className="basis-0 grow-[7] flex flex-col items-center justify-center bg-gray-100 p-4 pt-16">
        {/* Welcome Message */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">{screenData.welcomeMessage || 'Session Starting Soon'}</h1>
        </div>

        {/* Countdown Timer Area (with hover effect) */}
        <div
          className="text-center relative group" // Added relative and group
          onMouseEnter={() => setIsHoveringTimer(true)}
          onMouseLeave={() => setIsHoveringTimer(false)}
        >
          <p className="text-xl mb-3 text-gray-600">We will start in</p>
          <div className="text-8xl font-bold tabular-nums text-gray-900 mb-2"> {/* Added margin-bottom */}
            {formatTime(timeLeft)}
          </div>

          {/* Reset Buttons - Appear on hover */}
          <div
            className={`absolute bottom-[-40px] left-0 right-0 flex justify-center space-x-2 transition-all duration-300 ease-in-out ${
              isHoveringTimer ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`} // Conditional visibility and positioning
          >
            <button
              onClick={() => handleResetTimer(60)} // 1 min
              className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded hover:bg-indigo-600 transition-colors flex items-center"
              title="Reset to 1 minute"
            >
              <RefreshCw size={12} className="mr-1"/> 1m
            </button>
            <button
              onClick={() => handleResetTimer(120)} // 2 min
              className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded hover:bg-indigo-600 transition-colors flex items-center"
              title="Reset to 2 minutes"
            >
               <RefreshCw size={12} className="mr-1"/> 2m
            </button>
            <button
              onClick={() => handleResetTimer(300)} // 5 min
              className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded hover:bg-indigo-600 transition-colors flex items-center"
              title="Reset to 5 minutes"
            >
               <RefreshCw size={12} className="mr-1"/> 5m
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section -  Carousel */}
      <div className="basis-0 grow-[13] bg-gray-200 p-4 overflow-hidden">
        {screenData.newsItems && screenData.newsItems.length > 0 ? (
          <NewsCarousel newsItems={screenData.newsItems} />
        ) : (
          <div className="h-full flex items-center justify-center text-center text-gray-500">
            <p>No news items added for this screen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ---  Carousel Component ---
interface NewsCarouselProps {
  newsItems: StoredManualNewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ newsItems }) => {
  const settings = {
    dots: true,
    infinite: newsItems.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    arrows: false,
    className: "h-full",
  };

  const formatDate = (isoString: string): string => {
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className="h-full w-[90%] mx-auto">
      <Slider {...settings} className="h-full">
        {newsItems.map((news) => (
          <div key={news.id} className="p-2 h-full">
            <NewsCard
              title={news.title}
              content={news.content}
              date={formatDate(news.createdAt)}
              tags={news.tags}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DetailScreen;
