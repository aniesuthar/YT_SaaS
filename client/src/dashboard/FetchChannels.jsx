import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FetchChannels({authed}) {


    const [channels, setChannels] = useState([]);


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
        <div className="dashboard-container">
            <div className="dashboard-container-header">
                <p>Your Channels</p>
                <p className="time">December, 12</p>
            </div>

            {authed &&
                    <div>
                        <button onClick={handleFetchChannels}>Fetch Channels</button>
                        {channels.length > 0 && (
                            <div className='channel-list'>
                                <h2>Your YouTube Channels:</h2>
                                <ul>
                                    {channels.map((channel) => (
                                        <li key={channel.id}>
                                            <img src={channel.snippet.thumbnails.medium.url} />
                                            {channel.snippet.title} - {channel.statistics.viewCount} views
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
            }
        </div>
    )
}
