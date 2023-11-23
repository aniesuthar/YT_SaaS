import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import AccountProvider from '../../context/AccountProvider';



export default function UploadForm() {
    const [upPercent, setUpPercent] = useState(null);
    const [formData, setFormData] = useState({});

    const {socket} = useContext(AccountProvider);


    useEffect(() => {

        socket.on('progress', (data) => {
            // Update your React state or UI with the progress data
            console.log('Progress update:', data.progressString);
            setUpPercent(data.progressString);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Your form submission logic here
        // You can use formData to send the form data to the server

        try {
            // Using Axios to send a POST request to the server
            const response = await axios.post('http://localhost:5000/upload', formData, {
                // Ensure that Axios sends the request with the appropriate content type
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response as needed
            console.log('Server response:', response);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (event) => {
        // Handle form field changes and update the formData state
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(formData);
    };


    return (
        <div className="dashboard-container">
            <div className="dashboard-container-header">
                <p>Upload a video from Link</p>
                <p className="time">December, 12</p>
            </div>
            <form action='http://localhost:5000/upload' method='POST' encType='multipart/form-data' className='upload-form'>
                <input type="text" name="link" placeholder='Link' onChange={handleChange}/>
                <input type="text" name="title" placeholder='title' onChange={handleChange} />
                <input type="textarea" name="desc" placeholder='Description' onChange={handleChange} />
                <button className='upload-form' type="submit" onClick={handleSubmit}>{upPercent ? upPercent : "Upload Video"}</button>
            </form>
        </div>
    )
}