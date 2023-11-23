import React from 'react'
import { Link, NavLink } from "react-router-dom";
import './Login.scss'

export default function Login({AuthUrl}) {
  return (
      <div className='container'>
                <div className='login-section'>
                    <h2>Login to YT SaaS</h2>
                      <Link to={AuthUrl} className="auth-link">Login with Google</Link>
                      {/* <a href={AuthUrl} className="auth-link">Login with Google</a> */}
                  </div>
          {/* )} */}
      </div>
  )
}
