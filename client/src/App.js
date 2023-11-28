// client/src/App.js
import React from 'react';
import AccountProvider from "./context/AccountProvider";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import YTSaaS from './YTSaaS';
import './App.css'
import NotFound404 from './components/NotFound404';


function App() {

    return (
        <BrowserRouter>
            <AccountProvider>
                <YTSaaS />
            </AccountProvider>
        </BrowserRouter>
    );
}

export default App;
