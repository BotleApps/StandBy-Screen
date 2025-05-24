import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { ManualNewsItemDetails } from '../storage/standbyStorage';
import { Plus, Trash2, Image as ImageIcon, Type as TextIcon, ArrowLeft, ArrowRight } from 'lucide-react';

interface CountdownDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

// Interface for the data submitted from the form (includes both title and welcomeMessage)
interface StandbyScreenDetails {
  title: string; // Title for the card/list view
  welcomeMessage: string; // Message for the detail screen
  countdownDuration: CountdownDuration;
  category: string;
  backgroundColor: string;
  newsItems?: ManualNewsItemDetails[]; // Use newsItems array instead
}

interface CreateNewScreenPopupProps {
  onClose: () => void;
  onSubmit: (details: StandbyScreenDetails) => void;
}

const CreateNewScreenPopup: React.FC<CreateNewScreenPopupProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // Add step state, start at step 1
  const [title, setTitle] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('Thank you for joining, please stay tuned!');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(15); // Default to 15 minutes
  const [seconds, setSeconds] = useState(0);
  const [category, setCategory] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#4f46e5'); // Default to indigo
  // const [newsCategory, setNewsCategory] = useState(''); // Remove unused state

  // State for managing the list of manually added news items
  const [newsItems, setNewsItems] = useState<ManualNewsItemDetails[]>([]);
  // State for the current news item being added/edited in the sub-form
  const [currentNewsTitle, setCurrentNewsTitle] = useState('');
  const [currentNewsContentType, setCurrentNewsContentType] = useState<'text' | 'image'>('text');
  const [currentNewsContentValue, setCurrentNewsContentValue] = useState('');
  const [currentNewsTags, setCurrentNewsTags] = useState(''); // Comma-separated tags for input

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title, // Include title
      welcomeMessage,
      countdownDuration: {
        hours: Number(hours) || 0,
        minutes: Number(minutes) || 0,
        seconds: Number(seconds) || 0,
      },
      category,
      backgroundColor,
      newsItems: newsItems, // Pass the array of news items
    });
    // This function is now only called at the end (Step 2)
  };

  const handleNext = () => {
    // Basic validation for step 1 fields before proceeding
    if (!title || !category) {
        alert('Please fill in the Title and Category fields.');
        return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  // Function to add the current news item details to the list
  const handleAddNewsItem = () => {
    if (!currentNewsTitle || !currentNewsContentValue) {
      alert('Please fill in the news title and content.'); // Basic validation
      return;
    }
    const newItem: ManualNewsItemDetails = {
      title: currentNewsTitle,
      content: {
        type: currentNewsContentType,
        value: currentNewsContentValue,
      },
      tags: currentNewsTags.split(',').map(tag => tag.trim()).filter(tag => tag), // Split and clean tags
    };
    setNewsItems([...newsItems, newItem]);
    // Reset the sub-form fields
    setCurrentNewsTitle('');
    setCurrentNewsContentType('text');
    setCurrentNewsContentValue('');
    setCurrentNewsTags('');
  };

  // Function to remove a news item from the list by index
  const handleRemoveNewsItem = (indexToRemove: number) => {
    setNewsItems(newsItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      {/* Increase max-w-lg for slightly more space if needed */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Standby Screen - Step {step} of 2</h2>
        {/* Use a standard form tag, but handle submission logic based on step */}
        <form onSubmit={(e) => {
            // Prevent default form submission only if not on the final step
            if (step !== 2) {
                e.preventDefault();
            } else {
                handleSubmit(e); // Call the original submit handler on the final step
            }
        }}>
          {/* Step 1: Metadata */}
          {step === 1 && (
            <>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title (for list view)</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Welcome Message */}
              <div className="mb-4">
                <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">Welcome Message (for detail view)</label>
                <textarea
                  id="welcomeMessage"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
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
            </>
          )}

          {/* Step 2: Carousel Items */}
          {step === 2 && (
            <>
              {/* --- Carousel Items Section --- */}
              <div className="mb-6 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Add Carousel Items (Optional)</h3>

                {/* List of Added Carousel Items */}
                {newsItems.length > 0 && (
                  <div className="mb-4 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                    <ul className="space-y-2">
                      {newsItems.map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-sm p-1 bg-white rounded shadow-sm">
                          <span className="truncate flex-1 mr-2">{item.title} ({item.content.type})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewsItem(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sub-form for adding a new news item */}
                <div className="space-y-3 border border-gray-300 rounded-md p-3">
                  <h4 className="text-md font-medium text-gray-700">New Item</h4>
                  <div>
                    <label htmlFor="newsTitle" className="block text-sm font-medium text-gray-700">Item Title</label>
                    <input
                      id="newsTitle"
                      type="text"
                      value={currentNewsTitle}
                      onChange={(e) => setCurrentNewsTitle(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Content Type</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <button
                        type="button"
                        onClick={() => setCurrentNewsContentType('text')}
                        className={`p-2 rounded border ${currentNewsContentType === 'text' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                        <TextIcon size={18} />
                        </button>
                        <button
                        type="button"
                        onClick={() => setCurrentNewsContentType('image')}
                        className={`p-2 rounded border ${currentNewsContentType === 'image' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                     <ImageIcon size={18} />
                    </button>
                 </div>
              </div>
              {/* Content Input: Conditionally render Quill or standard input */}
              <div>
                <label htmlFor="newsContent" className="block text-sm font-medium text-gray-700">
                  {currentNewsContentType === 'text' ? 'Item Content (Rich Text)' : 'Item Content (Image URL)'}
                </label>
                {currentNewsContentType === 'text' ? (
                  // Wrap Quill editor in a div to control height and overflow
                  <div className="mt-1 quill-editor-container h-24 overflow-y-auto border border-gray-300 rounded-md">
                    <ReactQuill
                      theme="snow" // Use the "snow" theme for a standard toolbar
                      value={currentNewsContentValue}
                      onChange={setCurrentNewsContentValue} // Directly pass the setter
                      className="bg-white h-full" // Make Quill fill the container, remove border from Quill itself
                      modules={{ // Optional: Configure toolbar options
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link'], // Keep it simple for now
                        ['clean']
                        ],
                      }}
                      style={{ border: 'none' }} // Remove default Quill border as the wrapper has one
                    />
                  </div>
                ) : (
                  <input
                    id="newsContent"
                    type="url"
                    value={currentNewsContentValue}
                    onChange={(e) => setCurrentNewsContentValue(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    placeholder="https://example.com/image.png"
                  />
                )}
              </div>
               <div className="mt-4"> {/* Add margin-top if using Quill */}
                    <label htmlFor="newsTags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input
                      id="newsTags"
                      type="text"
                      value={currentNewsTags}
                      onChange={(e) => setCurrentNewsTags(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      placeholder="e.g., Update, Product, Important"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewsItem}
                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus size={18} className="mr-1 -ml-1" />
                    Add Item to List
                  </button>
                </div>
              </div>
              {/* --- End Items Section --- */}
            </>
          )}


          {/* Buttons: Conditionally render based on step */}
          <div className="flex justify-between pt-4 border-t border-gray-200 mt-6">
            {/* Cancel Button (Always visible) */}
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                Cancel
            </button>

            <div className="flex space-x-2">
                {/* Back Button (Visible on Step 2) */}
                {step === 2 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                         <ArrowLeft size={18} className="mr-1 -ml-1" />
                        Back
                    </button>
                )}

                {/* Next Button (Visible on Step 1) */}
                {step === 1 && (
                    <button
                        type="button" // Change type to button to prevent form submission
                        onClick={handleNext}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Next
                        <ArrowRight size={18} className="ml-1 -mr-1" />
                    </button>
                )}

                {/* Submit Button (Visible on Step 2) */}
                {step === 2 && (
                    <button
                        type="submit" // This button triggers the form's onSubmit
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewScreenPopup;
