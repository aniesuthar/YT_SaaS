import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from './context/AccountProvider';
import axios from 'axios';
import Dashboard from './dashboard/Dashboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './login/Login';


export default function YTSaaS() {
    const { authed, setAuthed, setCurrentAccount } = useContext(AccountContext)

    const [user, setUser] = useState({});
    const [AuthUrl, setAuthUrl] = useState(null);

    const navigate = useNavigate();





    useEffect(() => {
        // Fetch user information when the component mounts

        const getAuthURL = async () => {
            try {
                const response = await axios.get('http://localhost:5000/loggedin-user');
                setAuthUrl(response.data.url);
                setAuthed(response.data.authed);
                setCurrentAccount(response.data);
                setUser({ name: response.data.name, pic: response.data.pic });
                console.log("Login Use effect is working : currentAccount is: ", response.data);
                if (response.data.authed) {
                    // Use the 'history' object to navigate to the desired URL
                    // navigate.push('/dashboard');
                }

            } catch (error) {
                console.error('Error fetching user:', error.message);
            }

        }
        getAuthURL();
    }, [authed]);

    return (
        <>
            {/* {!authed ? */}
            <Routes>
                <Route path='/login' element={<Login AuthUrl={AuthUrl} />}></Route>
                <Route path='/' element={<Dashboard user={user} authed={authed} />}></Route>
             {/* : */}
            </Routes>
            {/* } */}
        </>
    );
}
