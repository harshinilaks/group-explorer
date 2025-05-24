import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import ZGroupDetails from './components/ZGroupDetails';
import DGroupDetails from './components/DGroupDetails';
import SGroupDetails from './components/SGroupDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Welcome />} />
        <Route path="/groups/Z/:id" element={<ZGroupDetails />} />
        <Route path="/groups/D/:id" element={<DGroupDetails />} />
        <Route path="/groups/S/:id" element={<SGroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
