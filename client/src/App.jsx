import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import GroupDetails from './components/GroupDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Welcome />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
