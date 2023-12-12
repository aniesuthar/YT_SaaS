import React, { useState, useEffect,useContext } from 'react';
import backIcon from '../../icons/back.png'
import TypeField from './TypeField';
import { AccountContext } from '../../context/AccountProvider';
import { getConversation, newMessage } from '../../api/api';
import Messages from './Messages';


export default function Conversation({ handleBack }) {

  const { sender, currentAccount, socket, setNewMessageFlag } = useContext(AccountContext);
  const [conversation, setConversation] = useState({});

  useEffect(() => {

    const getConversationDetails = async () => {
      var data = await getConversation({ senderId: sender.id, receiverId: currentAccount.id });
      setConversation(data);
    }
    getConversationDetails();
  }, []);




  let image;

  const [value, setValue] = useState();
  const [file, setFile] = useState();


  const sendText = async (e) => {
    e.preventDefault();
    if (!value) return;

    let message = {};
    if (!file) {
      message = {
        senderId: sender.id,
        receiverId: currentAccount.id,
        conversationId: conversation._id,
        type: 'text',
        text: value
      };
    } else {
      message = {
        senderId: sender.id,
        receiverId: currentAccount.id,
        conversationId: conversation?._id,
        type: 'file',
        text: image
      };
    }
    socket.current.emit('sendMessage', message);
    await newMessage(message);

    setValue('');
    setNewMessageFlag(prev => !prev);
  }


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
      <TypeField
        sendText={sendText}
        value={value}
        setValue={setValue}
        setFile={setFile}
        file={file}
      />
    </div>
  )
}
