// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './Components/Start';
import Home from './Components/Home';
import Finish from './Components/Finish';
import './Styling/App.css';

function App() {
    return (
        <div className="app-container">
            <Router>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/finish" element={<Finish />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
