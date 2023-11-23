// client/src/App.js
import React from 'react';
import AccountProvider from "./context/AccountProvider";
import { BrowserRouter } from 'react-router-dom';
import YTSaaS from './YTSaaS';
import './App.css'


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
