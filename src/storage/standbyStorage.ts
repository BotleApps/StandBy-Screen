import { v4 as uuidv4 } from 'uuid'; // Using uuid for unique IDs

// Define interfaces matching the popup's submitted data and stored structure
interface CountdownDuration {
  hours: number;
  minutes: number;
  seconds: number;
}

// Interface for the data submitted from the form
interface StandbyScreenDetails {
  title: string;
  countdownDuration: CountdownDuration;
  category: string;
  backgroundColor: string;
}

// Interface for the data stored in localStorage (includes id)
export interface StoredStandbyScreen extends StandbyScreenDetails {
  id: string;
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
 * Generates a unique ID for the new screen.
 */
export const addStandbyScreen = (screenDetails: StandbyScreenDetails): StoredStandbyScreen[] => {
  const screens = getStandbyScreens();
  const newScreen: StoredStandbyScreen = {
    ...screenDetails,
    id: uuidv4(), // Generate a unique ID
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

// Optional: Add updateStandbyScreen function if needed later
