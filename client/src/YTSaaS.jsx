import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from './context/AccountProvider';
import axios from 'axios';
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard';


export default function YTSaaS() {
    const { authed, setAuthed, setCurrentAccount } = useContext(AccountContext)

    const [user, setUser] = useState({});
    const [AuthUrl, setAuthUrl] = useState(null);





    useEffect(() => {
        // Fetch user information when the component mounts

        const getAuthURL = async () => {
            try {
                const response = await axios.get('http://localhost:5000/login');
                setAuthUrl(response.data.url);
                setAuthed(response.data.authed);
                setCurrentAccount(response.data);
                setUser({ name: response.data.name, pic: response.data.pic });

            } catch (error) {
                console.error('Error fetching user:', error.message);
            }

        }
        getAuthURL();
    }, [authed]);

    return (
        <>
            {!authed ?
                <Login AuthUrl={AuthUrl} /> : <Dashboard user={user} authed={authed} />
            }
        </>
    );
}
