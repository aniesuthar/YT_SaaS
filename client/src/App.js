// client/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import { io } from 'socket.io-client';
import { BrowserRouter } from 'react-router-dom';
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard';

function App() {
    const [user, setUser] = useState({});
    const [authed, setAuthed] = useState(false);
    const [AuthUrl, setAuthUrl] = useState(null);
    const [upPercent, setUpPercent] = useState(null);
    const [channels, setChannels] = useState([]);
    const [formData, setFormData] = useState({});





    useEffect(() => {
        // Fetch user information when the component mounts

        const getAuthURL = async () => {
            try {
                const response = await axios.get('http://localhost:5000/');
                setAuthUrl(response.data.url);
                setAuthed(response.data.authed);
                setUser({ name: response.data.name, pic: response.data.pic })
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }

        }

        // const fetchUser = async () => {
        //     try {
        //         const response = await axios.get('http://localhost:5000/user');
        //         setUser(response.data);
        //     } catch (error) {
        //         console.error('Error fetching user:', error.message);
        //     }
        // };

        // fetchUser();
        getAuthURL();
    }, []);

    return (
        <>
            <BrowserRouter>
                {!authed ?
                    <Login AuthUrl={AuthUrl} /> : <Dashboard user={user} channels={channels} authed={authed}/>
                }
            </BrowserRouter>
        </>
    );
}

export default App;
