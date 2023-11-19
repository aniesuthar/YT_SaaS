import React from 'react'
import { Link, NavLink } from "react-router-dom";
import './Login.scss'

export default function Login({AuthUrl}) {
  return (
      <div className='container'>
          {/* <h1>SaaS YouTube Upload</h1>
          {authed ? (
              <>
                  <div>
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
                                          <img src={channel.snippet.thumbnails.medium.url} />
                                          {channel.snippet.title} - {channel.statistics.viewCount} views
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>

                  <form onSubmit={handleSubmit} action='http://localhost:5000/upload' method='POST' encType='multipart/form-data' className='upload-form'>

                      <input type="text" name="link" onChange={handleChange} placeholder='Link' />
                      <input type="text" name="title" onChange={handleChange} placeholder='Title' />
                      <input type='text' name="desc" onChange={handleChange} placeholder='Description'></input>

                      <button type="submit">{upPercent ? upPercent : "Upload Video ZP"}</button>
                  </form>
              </>
          ) : ( */}
                <div className='login-section'>
                    <h2>Login to YT SaaS</h2>
                      <Link to={AuthUrl} className="auth-link">Login with Google</Link>
                      {/* <a href={AuthUrl} className="auth-link">Login with Google</a> */}
                  </div>
          {/* )} */}
      </div>
  )
}
