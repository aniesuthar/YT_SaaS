import React, { useContext, useState } from 'react'
import { Link, NavLink } from "react-router-dom";
import axios from 'axios';
import { AccountContext } from '../context/AccountProvider';
import './Login.scss'


export default function Login({ AuthUrl }) {
    // const { setCurrentAccount } = useContext(AccountContext);
    const [user, setUser] = useState({});


    const url = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=profile%20email%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&response_type=code&client_id=559102681862-bcbqu4ed3hrtg43v3mju7o03t8rl934j.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback";

    const Login = async () => {
        try {
            const response = await axios.get('http://localhost:5000/login');

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

    return (
        <div className='container'>
            <div className='login-section'>
                <h2>Login to YT SaaS</h2>
                <Link to={url} className="auth-link" onClick={Login}>Login with Google</Link>
                {/* <a href={AuthUrl} className="auth-link">Login with Google</a> */}
            </div>
            {/* )} */}
        </div>
    )
}
