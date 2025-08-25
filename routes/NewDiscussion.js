import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Discussions from './pages/Discussions';
import NewDiscussion from './pages/NewDiscussion';
import Discussion from './pages/Discussion';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/new-discussion" element={<NewDiscussion />} />
                <Route path="/discussion/:id" element={<Discussion />} />
            </Routes>
        </Router>
    );
};

export default App;
