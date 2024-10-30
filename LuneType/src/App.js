import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Start from './Components/Start';
import Play from './Components/Play';
import Lobby from './Components/Lobby';
import Finish from './Components/Finish';
import Login from './Components/Login';
import Register from './Components/Register';
import './Styling/App.css';

// Faster fade transition with dark overlay effect
const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
};

// Shorten the transition duration to speed it up
const pageTransition = { duration: 0.3 };

function App() {
    return (
        <div className="app-container dark-transition-overlay">
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
        </div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route
                    path="/"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Start />
                        </motion.div>
                    }
                />
                <Route
                    path="/start"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Start />
                        </motion.div>
                    }
                />
                <Route
                    path="/lobby"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Lobby />
                        </motion.div>
                    }
                />
                <Route
                    path="/play"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Play />
                        </motion.div>
                    }
                />
                <Route
                    path="/finish"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Finish />
                        </motion.div>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Login />
                        </motion.div>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="motion-container"
                        >
                            <Register />
                        </motion.div>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

export default App;
