// client/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';
import io from 'socket.io-client';

function App() {
    const [user, setUser] = useState({});
    const [authed, setAuthed] = useState(false);
    const [AuthUrl, setAuthUrl] = useState(null);
    const [upPercent, setUpPercent] = useState(null);
    const [channels, setChannels] = useState([]);




    useEffect(() => {
        // Fetch user information when the component mounts

        const getAuthURL = async () => {
            try {
                const response = await axios.get('http://localhost:5000/');
                console.log(response);
                setAuthUrl(response.data.url);
                setAuthed(response.data.authed);
                setUser({ name: response.data.name, pic: response.data.pic })
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }

        }

        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        fetchUser();
        getAuthURL();
    }, []);

    const handleFetchChannels = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-channel-info');
            console.log(response.data);
            // Assuming the response contains an array of channels
            setChannels(response.data.channels);
        } catch (error) {
            console.error('Error fetching channels:', error.message);
        }
    };
 
    useEffect(() => {
        const socket = io('https://localhost:5000/');

        socket.on('progress', (data) => {
            // Update your React state or UI with the progress data
            console.log('Progress update:', data.progressString);
            setUpPercent(data.progressString);
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    return (
        <>
            <div className='container'>
                <h1>SaaS YouTube Upload</h1>
                {authed ? (
                    <>
                        <div>
                            {/* <p>Welcome Anil!</p> */}
                            <div className="user-info">
                            <p>Welcome, {user.name}!</p>
                            <img src={user.pic}></img>
                            </div>
                            <button onClick={handleFetchChannels}>Fetch Channels</button>
                            {channels.length > 0 && (
                                <div className='channel-list'>
                                    <h2>Your YouTube Channels:</h2>
                                    <ul>
                                        {channels.map((channel) => (
                                            <li key={channel.id}>
                                                <img src={channel.snippet.thumbnails.medium.url}/>
                                                {channel.snippet.title} - {channel.statistics.viewCount} views
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <form action='http://localhost:5000/upload' method='POST' encType='multipart/form-data' className='upload-form'>
                            <input type="text" name="link" placeholder='Link'/>
                            <input type="text" name="title" placeholder='title'/>
                            <input type="textarea" name="desc" placeholder='Description'/>
                            <button className='upload-form' type="submit">{upPercent ? upPercent : "Upload Video"}</button>
                        </form>

                    </>
                ) : (
                    <a className="auth-link" href={AuthUrl}>Login with Google</a>
                )}
            </div>


        </>
    );
}

export default App;
