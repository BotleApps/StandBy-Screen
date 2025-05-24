import { v4 as uuidv4 } from 'uuid'; // Using uuid for unique IDs

// Define interfaces matching the popup's submitted data and stored structure
interface CountdownDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

// Interface for a single manually added news item (as submitted)
export interface ManualNewsItemDetails {
  title: string;
  content: { type: 'text'; value: string } | { type: 'image'; value: string };
  tags: string[]; // Array of strings for tags/categories
}

// Interface for a stored news item (includes system-generated fields)
export interface StoredManualNewsItem extends ManualNewsItemDetails {
  id: string; // Unique ID for the news item itself
  createdAt: string; // ISO timestamp string
}

// Interface for the data submitted from the form
interface StandbyScreenDetails {
  title: string;
  welcomeMessage: string;
  countdownDuration: CountdownDuration;
  category: string;
  backgroundColor: string;
  newsItems?: ManualNewsItemDetails[]; // Array of manually added news items
}

// Interface for the data stored in localStorage (includes id and processed news items)
export interface StoredStandbyScreen extends Omit<StandbyScreenDetails, 'newsItems'> {
  id: string;
  newsItems?: StoredManualNewsItem[]; // Stored news items include id and createdAt
}

const STORAGE_KEY = 'standbyScreens';

/**
 * Retrieves the list of standby screens from localStorage.
 * Returns an empty array if no screens are found or if there's a parsing error.
 */
export const getStandbyScreens = (): StoredStandbyScreen[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsedData)) {
        return parsedData as StoredStandbyScreen[];
      }
    }
  } catch (error) {
    console.error("Error reading standby screens from localStorage:", error);
  }
  return []; // Return empty array if no data or error
};

/**
 * Saves the list of standby screens to localStorage.
 */
const saveStandbyScreens = (screens: StoredStandbyScreen[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(screens));
  } catch (error) {
    console.error("Error saving standby screens to localStorage:", error);
  }
};

/**
 * Adds a new standby screen to localStorage.
 * Generates a unique ID for the new screen and its news items.
 * Adds createdAt timestamp to news items.
 */
export const addStandbyScreen = (screenDetails: StandbyScreenDetails): StoredStandbyScreen[] => {
  const screens = getStandbyScreens();

  // Process news items: add id and createdAt timestamp
  const processedNewsItems = screenDetails.newsItems?.map(item => ({
    ...item,
    id: uuidv4(), // Unique ID for each news item
    createdAt: new Date().toISOString(), // Add timestamp
  }));

  const newScreen: StoredStandbyScreen = {
    ...screenDetails,
    id: uuidv4(), // Generate a unique ID for the screen
    newsItems: processedNewsItems, // Use the processed news items
  };

  const updatedScreens = [...screens, newScreen];
  saveStandbyScreens(updatedScreens);
  return updatedScreens; // Return the updated list
};

/**
 * Deletes a standby screen from localStorage by its ID.
 */
export const deleteStandbyScreen = (id: string): StoredStandbyScreen[] => {
    const screens = getStandbyScreens();
    const updatedScreens = screens.filter(screen => screen.id !== id);
    saveStandbyScreens(updatedScreens);
    return updatedScreens;
};

/**
 * Retrieves a single standby screen from localStorage by its ID.
 * Returns undefined if the screen is not found.
 */
export const getStandbyScreenById = (id: string): StoredStandbyScreen | undefined => {
    const screens = getStandbyScreens();
    return screens.find(screen => screen.id === id);
};

/**
 * Clears all standby screens from localStorage.
 */
export const clearStandbyScreens = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Standby screens cleared from localStorage.');
    } catch (error) {
        console.error("Error clearing standby screens from localStorage:", error);
    }
};

/**
 * Updates a standby screen in localStorage by its ID.
 * Returns the updated list of screens.
 */
export const updateStandbyScreen = (updatedScreen: StoredStandbyScreen): StoredStandbyScreen[] => {
    const screens = getStandbyScreens();
    const updatedScreens = screens.map(screen => 
        screen.id === updatedScreen.id ? updatedScreen : screen
    );
    saveStandbyScreens(updatedScreens);
    return updatedScreens;
};
