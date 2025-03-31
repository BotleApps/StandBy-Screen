import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Slider from 'react-slick';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react'; // Import icons
import NewsCard from '../components/NewsCard'; // Import NewsCard

// Helper function to format time
const formatTime = (timeInSeconds: number): string => {
  if (timeInSeconds <= 0) return '00:00:00';
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const DetailScreen: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  // Placeholder target time (e.g., 10 minutes from now)
  // In a real app, this would come from props or route state based on the selected card
  const [targetTime] = useState<Date>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // Set target 10 mins in the future
    return now;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const now = new Date();
    return Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    // Cleanup interval on component unmount or when timer reaches 0
    return () => clearInterval(timerId);
  }, [timeLeft]); // Rerun effect if timeLeft changes (specifically when it hits 0)

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

  // Listen for fullscreen changes to update state
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);


  return (
    <div className="flex flex-col h-screen relative"> {/* Added relative positioning for absolute children */}
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

      {/* Top Section (35%) */}
      <div className="basis-0 grow-[7] flex flex-col items-center justify-center bg-gray-100 p-4 pt-16"> {/* Use grow-[7] for ~35%, added basis-0 */}
        {/* Welcome Message */}
        <div className="mb-10 text-center"> {/* Increased margin bottom */}
          <h1 className="text-3xl font-semibold text-gray-800">Thank you for joining the session, please stay tuned!</h1> {/* Increased font size */}
        </div>
        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-xl mb-3 text-gray-600">We will start in</p> {/* Increased font size and margin bottom */}
          <div className="text-8xl font-bold tabular-nums text-gray-900"> {/* Increased font size, tabular-nums prevents width changes */}
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Bottom Section - Carousel (65%) */}
      <div className="basis-0 grow-[13] bg-gray-200 p-4 overflow-hidden"> {/* Use grow-[13] for ~65%, added basis-0 */}
        <NewsCarousel />
      </div>
    </div>
  );
};

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
