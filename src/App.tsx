import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen'; // Import DetailScreen
import './index.css'; // Ensure Tailwind styles are loaded

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      {/* Update route to accept screenId parameter */}
      <Route path="/detail/:screenId" element={<DetailScreen />} />
    </Routes>
  );
}

export default App;
