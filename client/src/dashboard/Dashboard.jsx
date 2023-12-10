import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { AccountContext } from '../context/AccountProvider';
import './Dashboard.scss'
import ProjectBoxes from './ProjectBoxes';
import Login from '../login/Login';
import Conversations from './conversations/Conversations';
import ProjectsSection from './ProjectsSection';
import FetchChannels from './FetchChannels';
import UploadForm from './Form/UploadForm'
import { logout } from '../api/api';
import NotFound404 from '../components/NotFound404';

export default function Dashboard({ user, channels, authed, children }) {



    

    const { setAuthed, setCurrentAccount } = useContext(AccountContext);
    const [AuthUrl, setAuthUrl] = useState(null);

    const [isDarkMode, setDarkMode] = useState(false);
    const [isListView, setListView] = useState(true);
    const [activeTab, setActiveTab] = useState();

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark', !isDarkMode);
        document.querySelector('.mode-switch').classList.toggle('active');
        setDarkMode(!isDarkMode);
    };

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

    const showMessagesSection = () => {
        document.querySelector('.messages-section').classList.add('show');
    };

    const hideMessagesSection = () => {
        document.querySelector('.messages-section').classList.remove('show');
    };

    useEffect(() => {
        document.addEventListener('DOMContentLoaded', () => {
            // document.querySelector('.mode-switch').addEventListener('click', toggleDarkMode);
            document.querySelector('.list-view').addEventListener('click', switchToListView);
            document.querySelector('.grid-view').addEventListener('click', switchToGridView);
            document.querySelector('.messages-btn').addEventListener('click', showMessagesSection);
            document.querySelector('.messages-close').addEventListener('click', hideMessagesSection);

            return () => {
                // Cleanup event listeners on component unmount
                document.querySelector('.mode-switch').removeEventListener('click', toggleDarkMode);
                document.querySelector('.list-view').removeEventListener('click', switchToListView);
                document.querySelector('.grid-view').removeEventListener('click', switchToGridView);
                document.querySelector('.messages-btn').removeEventListener('click', showMessagesSection);
                document.querySelector('.messages-close').removeEventListener('click', hideMessagesSection);
            };
        });
    }, [isDarkMode, isListView]);

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const response = await logout();
            setAuthed(response.authed);
            setCurrentAccount(null);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }


    return (
        <div className="app-container">
            <div className="app-header">
                <div className="app-header-left">
                    <span className="app-icon" />
                    <p className="app-name">YT SaaS</p>
                    <div className="search-wrapper">
                        <input className="search-input" type="text" placeholder="Search" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="feather feather-search"
                            viewBox="0 0 24 24"
                        >
                            <defs />
                            <circle cx={11} cy={11} r={8} />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </div>
                </div>
                <div className="app-header-right">
                    <button className="mode-switch" title="Switch Theme" onClick={toggleDarkMode}>
                        <svg
                            className="moon"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                        >
                            <defs />
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    </button>
                    <button className="add-btn" title="Add New Project">
                        <svg
                            className="btn-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1={12} y1={5} x2={12} y2={19} />
                            <line x1={5} y1={12} x2={19} y2={12} />
                        </svg>
                    </button>
                    <button className="notification-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-bell"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    <button className="profile-btn" title="LOGOUT" onClick={handleLogout}>
                        <img src={user.pic} />
                        <span>Hi, {user.name}!</span>
                    </button>
                </div>
                <button className="messages-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-message-circle"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                </button>
            </div>
            <div className="app-content">
                <div className="app-sidebar">
                    <NavLink to="/" className="app-sidebar-link" title="Dashboard">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-home"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </NavLink>
                    <NavLink to="/fetch-channels" className="app-sidebar-link" title="Fetch Channels">
                        <svg
                            className="link-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <defs />
                            <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" />
                        </svg>
                    </NavLink>
                    <NavLink to="/upload-form" className="app-sidebar-link" title="Upload to YOUTUBE">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-calendar"
                        >
                            <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
                            <line x1={16} y1={2} x2={16} y2={6} />
                            <line x1={8} y1={2} x2={8} y2={6} />
                            <line x1={3} y1={10} x2={21} y2={10} />
                        </svg>
                    </NavLink>
                    <NavLink to="/login" className="app-sidebar-link" title="LOGIN">
                        <svg
                            className="link-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <defs />
                            <circle cx={12} cy={12} r={3} />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                    </NavLink>
                </div>
                {/* <Routes>
                    <Route index element={<ProjectsSection switchView={{ switchToGridView, switchToListView }} />} ></Route>
                    <Route path="fetch-channels" element={<FetchChannels authed={authed} />}></Route>
                    <Route path="upload-form" element={<UploadForm />} />
                </Routes> */}
                    {children}
                <div className="messages-section">
                    <button className="messages-close">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x-circle"
                        >
                            <circle cx={12} cy={12} r={10} />
                            <line x1={15} y1={9} x2={9} y2={15} />
                            <line x1={9} y1={9} x2={15} y2={15} />
                        </svg>
                    </button>
                    <div className="messages-section-header">
                        <p>Messages</p>
                    </div>
                    <Conversations />
                </div>
            </div>
        </div>

    )
}
