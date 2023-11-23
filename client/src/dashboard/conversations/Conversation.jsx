import React, { useState, useEffect,useContext } from 'react';
import backIcon from '../../icons/back.png'
import TypeField from './TypeField';
import { AccountContext } from '../../context/AccountProvider';
import { getConversation } from '../../api/api';
import Messages from './Messages';

export default function Conversation({ handleBack }) {

  const { sender, currentAccount } = useContext(AccountContext);
  const [conversation, setConversation] = useState({});

  useEffect(() => {

    const getConversationDetails = async () => {
      var data = await getConversation({ senderId: sender.id, receiverId: currentAccount.id });
      setConversation(data);
    }
    getConversationDetails();
  }, []);


  return (
    <div className="conversation">
      <div className="conversation-header">
        <button onClick={() => handleBack()}>
          <img src={backIcon} height="32px" width="32px" alt="" title="back"/></button>
        <img
          src={sender.picture}
          alt="profile image" />
        <span>{sender.name}</span>
      </div>
      <Messages conversation={conversation}/>
    </div>
  )
}
