import React from 'react';
import backIcon from '../../icons/back.png'

export default function Conversation({ handleSetConversation }) {
  return (
    <div className="conversation">
      <div className="conversation-header">
        <button onClick={handleSetConversation}>
          <img src={backIcon} height="32px" width="32px" alt="" /></button>
        <img
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          alt="profile image" />
        <span>Stephanie</span>
      </div>
      <div className="messages">
        <div className="messages-container">
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
          <p>Received</p>
          <p className='own'>Sent</p>
        </div>
      </div>
      <div className="type-message">
        <input type="text" placeholder='Type Message Here...'/>
        <button>Send</button>
      </div>
    </div>
  )
}
