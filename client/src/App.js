// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [user, setUser] = useState({});
    const [authed, setAuthed] = useState(false);
    const [AuthUrl, setAuthUrl] = useState(null);
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

    const handleUpload = async () => {
        try {
            const response = await axios.get('http://localhost:5000/upload-to-youtube');
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading to YouTube:', error.message);
        }
    };

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

    return (
        <>
            <div>
                <h1>SaaS YouTube Upload</h1>
                {authed ? (
                    <>
                        <div>
                            {/* <p>Welcome Anil!</p> */}
                            <p>Welcome, {user.name}!</p>
                            <img src={user.pic}></img>
                            <button onClick={handleUpload}>Upload to YouTube</button>
                            <button onClick={handleFetchChannels}>Fetch Channels</button>
                            {channels.length > 0 && (
                                <div>
                                    <h2>Your YouTube Channels:</h2>
                                    <ul>
                                        {channels.map((channel) => (
                                            <li key={channel.id}>
                                                {channel.title} - {channel.views} views
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <form action='http://localhost:5000/upload' method='POST' encType='multipart/form-data'>
                            <input type="text" name="link" placeholder='Link'/>
                            <input type="text" name="title" placeholder='title'/>
                            <input type="textarea" name="desc" placeholder='Description'/>
                            <button type="submit">Upload Video</button>
                        </form>

                    </>
                ) : (
                    <a href={AuthUrl}>Login with Google</a>
                )}
            </div>


        </>
    );
}

export default App;
