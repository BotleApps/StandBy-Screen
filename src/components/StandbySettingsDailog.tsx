import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, Plus, Trash2, Image as ImageIcon, Type as TextIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { StoredStandbyScreen, ManualNewsItemDetails } from '../storage/standbyStorage';

interface StandbySettingsDialogProps {
  standby_screen: StoredStandbyScreen;
  standby_isOpen: boolean;
  standby_onClose: () => void;
  standby_onSave: (updatedScreen: StoredStandbyScreen) => void;
}

const StandbySettingsDialog: React.FC<StandbySettingsDialogProps> = ({ 
  standby_screen, 
  standby_isOpen, 
  standby_onClose, 
  standby_onSave 
}) => {
  // Step state for navigation
  const [standby_step, setStandby_step] = useState(1);
  
  // Initialize state with current screen values using standby_ prefix
  const [standby_title, setStandby_title] = useState(standby_screen.title);
  const [standby_welcomeMessage, setStandby_welcomeMessage] = useState(standby_screen.welcomeMessage);
  const [standby_hours, setStandby_hours] = useState(standby_screen.countdownDuration.hours);
  const [standby_minutes, setStandby_minutes] = useState(standby_screen.countdownDuration.minutes);
  const [standby_seconds, setStandby_seconds] = useState(standby_screen.countdownDuration.seconds);
  const [standby_category, setStandby_category] = useState(standby_screen.category);
  const [standby_backgroundColor, setStandby_backgroundColor] = useState(standby_screen.backgroundColor);
  const [standby_newsItems, setStandby_newsItems] = useState<ManualNewsItemDetails[]>(
    standby_screen.newsItems?.map(item => ({
      title: item.title,
      content: item.content,
      tags: item.tags
    })) || []
  );

  // State for adding new news items with standby_ prefix
  const [standby_currentNewsTitle, setStandby_currentNewsTitle] = useState('');
  const [standby_currentNewsContentType, setStandby_currentNewsContentType] = useState<'text' | 'image'>('text');
  const [standby_currentNewsContentValue, setStandby_currentNewsContentValue] = useState('');
  const [standby_currentNewsTags, setStandby_currentNewsTags] = useState('');

  // Update state when screen prop changes
  useEffect(() => {
    setStandby_title(standby_screen.title);
    setStandby_welcomeMessage(standby_screen.welcomeMessage);
    setStandby_hours(standby_screen.countdownDuration.hours);
    setStandby_minutes(standby_screen.countdownDuration.minutes);
    setStandby_seconds(standby_screen.countdownDuration.seconds);
    setStandby_category(standby_screen.category);
    setStandby_backgroundColor(standby_screen.backgroundColor);
    setStandby_newsItems(
      standby_screen.newsItems?.map(item => ({
        title: item.title,
        content: item.content,
        tags: item.tags
      })) || []
    );
  }, [standby_screen]);

  // Navigation functions
  const standby_handleNext = () => {
    // Basic validation for step 1 fields before proceeding
    if (!standby_title || !standby_category) {
      alert('Please fill in the Title and Category fields.');
      return;
    }
    setStandby_step(2);
  };

  const standby_handleBack = () => {
    setStandby_step(1);
  };

  const standby_handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!standby_title || !standby_category) {
      alert('Please fill in the Title and Category fields.');
      return;
    }

    const standby_updatedScreen: StoredStandbyScreen = {
      ...standby_screen,
      title: standby_title,
      welcomeMessage: standby_welcomeMessage,
      countdownDuration: {
        hours: Number(standby_hours) || 0,
        minutes: Number(standby_minutes) || 0,
        seconds: Number(standby_seconds) || 0,
      },
      category: standby_category,
      backgroundColor: standby_backgroundColor,
      newsItems: standby_newsItems.map(item => ({
        ...item,
        id: standby_screen.newsItems?.find(existingItem => 
          existingItem.title === item.title && 
          existingItem.content.value === item.content.value
        )?.id || `standby-news-${Date.now()}-${Math.random()}`,
        createdAt: standby_screen.newsItems?.find(existingItem => 
          existingItem.title === item.title && 
          existingItem.content.value === item.content.value
        )?.createdAt || new Date().toISOString(),
      }))
    };

    standby_onSave(standby_updatedScreen);
    standby_onClose();
  };

  const standby_handleAddNewsItem = () => {
    if (!standby_currentNewsTitle || !standby_currentNewsContentValue) {
      alert('Please fill in the news title and content.');
      return;
    }

    const standby_newItem: ManualNewsItemDetails = {
      title: standby_currentNewsTitle,
      content: {
        type: standby_currentNewsContentType,
        value: standby_currentNewsContentValue,
      },
      tags: standby_currentNewsTags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setStandby_newsItems([...standby_newsItems, standby_newItem]);
    setStandby_currentNewsTitle('');
    setStandby_currentNewsContentType('text');
    setStandby_currentNewsContentValue('');
    setStandby_currentNewsTags('');
  };

  const standby_handleRemoveNewsItem = (standby_indexToRemove: number) => {
    setStandby_newsItems(standby_newsItems.filter((_, index) => index !== standby_indexToRemove));
  };

  if (!standby_isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Standby Screen Settings - Step {standby_step} of 2</h2>
          <button
            onClick={standby_onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Close Settings"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => {
            // Prevent default form submission only if not on the final step
            if (standby_step !== 2) {
                e.preventDefault();
            } else {
                standby_handleSubmit(e); // Call the original submit handler on the final step
            }
        }}>
          {/* Step 1: Basic Settings Section */}
          {standby_step === 1 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Basic Settings</h3>
            
            {/* Title */}
            <div>
              <label htmlFor="standby-edit-title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="standby-edit-title"
                type="text"
                value={standby_title}
                onChange={(e) => setStandby_title(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Welcome Message */}
            <div>
              <label htmlFor="standby-edit-welcomeMessage" className="block text-sm font-medium text-gray-700">Welcome Message</label>
              <textarea
                id="standby-edit-welcomeMessage"
                value={standby_welcomeMessage}
                onChange={(e) => setStandby_welcomeMessage(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={3}
                required
              />
            </div>

            {/* Countdown Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Countdown Duration</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="standby-edit-hours" className="block text-xs text-gray-500">Hours</label>
                  <input
                    id="standby-edit-hours"
                    type="number"
                    min="0"
                    value={standby_hours}
                    onChange={(e) => setStandby_hours(parseInt(e.target.value, 10) || 0)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="standby-edit-minutes" className="block text-xs text-gray-500">Minutes</label>
                  <input
                    id="standby-edit-minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={standby_minutes}
                    onChange={(e) => setStandby_minutes(parseInt(e.target.value, 10) || 0)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="standby-edit-seconds" className="block text-xs text-gray-500">Seconds</label>
                  <input
                    id="standby-edit-seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={standby_seconds}
                    onChange={(e) => setStandby_seconds(parseInt(e.target.value, 10) || 0)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="standby-edit-category" className="block text-sm font-medium text-gray-700">Category</label>
              <input
                id="standby-edit-category"
                type="text"
                value={standby_category}
                onChange={(e) => setStandby_category(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Background Color */}
            <div>
              <label htmlFor="standby-edit-backgroundColor" className="block text-sm font-medium text-gray-700">Background Color</label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  id="standby-edit-backgroundColor"
                  type="color"
                  value={standby_backgroundColor}
                  onChange={(e) => setStandby_backgroundColor(e.target.value)}
                  className="h-10 w-10 p-0 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={standby_backgroundColor}
                  onChange={(e) => setStandby_backgroundColor(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="#rrggbb"
                />
                <div 
                  className="w-16 h-10 rounded-md border border-gray-300"
                  style={{ backgroundColor: standby_backgroundColor }}
                  title="Color Preview"
                />
              </div>
            </div>
          </div>
          )}

          {/* Step 2: News Items Management Section */}
          {standby_step === 2 && (
          <div className="mb-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Manage Carousel Items ({standby_newsItems.length} items)</h3>

            {/* List of existing news items */}
            {standby_newsItems.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="space-y-3">
                  {standby_newsItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-white rounded shadow-sm border">
                      <div className="flex-1 mr-3">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Type: <span className="font-medium">{item.content.type}</span>
                        </div>
                        {item.content.type === 'text' && (
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            Content: {item.content.value.replace(/<[^>]*>/g, '').substring(0, 50)}...
                          </div>
                        )}
                        {item.content.type === 'image' && (
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            URL: {item.content.value}
                          </div>
                        )}
                        {item.tags.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            Tags: {item.tags.join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => standby_handleRemoveNewsItem(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new news item form */}
            <div className="space-y-4 border border-gray-300 rounded-md p-4 bg-indigo-50">
              <h4 className="text-md font-medium text-gray-700 flex items-center">
                <Plus size={16} className="mr-2" />
                Add New Item
              </h4>
              
              <div>
                <label htmlFor="standby-edit-newsTitle" className="block text-sm font-medium text-gray-700">Item Title</label>
                <input
                  id="standby-edit-newsTitle"
                  type="text"
                  value={standby_currentNewsTitle}
                  onChange={(e) => setStandby_currentNewsTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter news title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setStandby_currentNewsContentType('text')}
                    className={`flex items-center p-3 rounded border transition-colors duration-200 ${
                      standby_currentNewsContentType === 'text' 
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <TextIcon size={18} className="mr-2" />
                    Rich Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setStandby_currentNewsContentType('image')}
                    className={`flex items-center p-3 rounded border transition-colors duration-200 ${
                      standby_currentNewsContentType === 'image' 
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <ImageIcon size={18} className="mr-2" />
                    Image URL
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="standby-edit-newsContent" className="block text-sm font-medium text-gray-700 mb-2">
                  {standby_currentNewsContentType === 'text' ? 'Item Content (Rich Text)' : 'Image URL'}
                </label>
                {standby_currentNewsContentType === 'text' ? (
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={standby_currentNewsContentValue}
                      onChange={setStandby_currentNewsContentValue}
                      className="bg-white"
                      style={{ minHeight: '120px' }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          ['link', 'blockquote'],
                          ['clean']
                        ],
                      }}
                      placeholder="Enter rich text content..."
                    />
                  </div>
                ) : (
                  <input
                    type="url"
                    value={standby_currentNewsContentValue}
                    onChange={(e) => setStandby_currentNewsContentValue(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>

              <div>
                <label htmlFor="standby-edit-newsTags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  id="standby-edit-newsTags"
                  type="text"
                  value={standby_currentNewsTags}
                  onChange={(e) => setStandby_currentNewsTags(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="breaking, sports, technology..."
                />
              </div>

              <button
                type="button"
                onClick={standby_handleAddNewsItem}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center"
              >
                <Plus size={18} className="mr-2" />
                Add Item
              </button>
            </div>
          </div>
          )}

          {/* Form Actions: Conditionally render based on step */}
          <div className="flex justify-between pt-4 border-t border-gray-200 mt-6">
            {/* Cancel Button (Always visible) */}
            <button
              type="button"
              onClick={standby_onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>

            <div className="flex space-x-2">
              {/* Back Button (Visible on Step 2) */}
              {standby_step === 2 && (
                <button
                  type="button"
                  onClick={standby_handleBack}
                  className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <ArrowLeft size={18} className="mr-1 -ml-1" />
                  Back
                </button>
              )}

              {/* Next Button (Visible on Step 1) */}
              {standby_step === 1 && (
                <button
                  type="button"
                  onClick={standby_handleNext}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                  <ArrowRight size={18} className="ml-1 -mr-1" />
                </button>
              )}

              {/* Save Button (Visible on Step 2) */}
              {standby_step === 2 && (
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StandbySettingsDialog;