import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Finish from './Finish';
import './App.css';  // Import the global CSS

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/finish" element={<Finish />} />
            </Routes>
        </Router>
    );
}

export default App;
