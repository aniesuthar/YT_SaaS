import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from './context/AccountProvider';
import axios from 'axios';
import Dashboard from './dashboard/Dashboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import ProjectsSection from './dashboard/ProjectsSection';
import FetchChannels from './dashboard/FetchChannels';
import UploadForm from './dashboard/Form/UploadForm';
import NotFound404 from './components/NotFound404';


export default function YTSaaS() {
    const { authed, setAuthed, setCurrentAccount } = useContext(AccountContext)

    const [user, setUser] = useState({});
    const [AuthUrl, setAuthUrl] = useState(null);
    const [isListView, setListView] = useState(true);

    const navigate = useNavigate();


    const switchToListView = () => {
        setListView(true);
        document.querySelector('.grid-view').classList.remove('active');
        document.querySelector('.list-view').classList.add('active');
        document.querySelector('.project-boxes').classList.remove('jsGridView');
        document.querySelector('.project-boxes').classList.add('jsListView');
    };

    const switchToGridView = () => {
        setListView(false);
        document.querySelector('.grid-view').classList.add('active');
        document.querySelector('.list-view').classList.remove('active');
        document.querySelector('.project-boxes').classList.remove('jsListView');
        document.querySelector('.project-boxes').classList.add('jsGridView');
    };




    useEffect(() => {
        // Fetch user information when the component mounts

        const me = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/me', {
                    withCredentials: true
                });
                // setAuthUrl(response.data.url);
                setAuthed(true);
                setCurrentAccount(response.data);
                setUser({ name: response.data.name, pic: response.data.picture });
                if (response.data.authed) {
                    // Use the 'history' object to navigate to the desired URL
                    // navigate.push('/dashboard');
                }

            } catch (error) {
                console.error('Error fetching user:', error.message);
            }

        }
        me();
    }, []);


    return (
        <>
            {/* {!authed ? */}
            <Routes>
                <Route
                    path='/*'
                    element={
                        authed ? (
                            <Dashboard user={user} authed={authed}>
                                <Routes>
                                    <Route index element={<ProjectsSection switchView={{ switchToGridView, switchToListView }} />} />
                                    <Route path="/fetch-channels" element={<FetchChannels authed={authed} />} />
                                    <Route path="/upload-form" element={<UploadForm />} />
                                    <Route path='*' element={<NotFound404 />} />
                                </Routes>
                            </Dashboard>
                        ) : (
                            <Login AuthUrl={AuthUrl} />
                        )
                    }
                />
                <Route path='*' element={<NotFound404 />} />
            </Routes>
            {/* } */}
        </>
    );
}
