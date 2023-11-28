import React, { useState, useEffect, useContext } from 'react'
import Conversation from './Conversation';
import { getUsers, setConversation } from '../../api/api';
import { AccountContext } from '../../context/AccountProvider';



export default function Conversations() {

    const [chat, setChat] = useState(false);
    const { sender, setSender, currentAccount } = useContext(AccountContext);
    // const { account, socket, setActiveUsers } = useContext(AccountContext);

    const [users, setUsers] = useState([]);

    console.log("Current Account", currentAccount);
    const handleSetChat = async (user) => {
        setSender(user);
        setChat(!chat);
        // console.log(sender);
        await setConversation({ senderId: user.id, receiverId: currentAccount.id });
    }
    const handleBack = () => {
        setChat(!chat);
        setSender(null);
    }

    useEffect(() => {
        const fetchData = async () => {
            let data = await getUsers();
            // let filteredData = data.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
            // setUsers(filteredData);
            setUsers(data);
        }
        fetchData();
    }, [sender]);

    return (
        chat ? <Conversation handleBack={handleBack} /> :
            <div className="conversations-container">
                <div className="conversations">
                    {
                        users && users.map((user, index) => (

                            currentAccount.id !== user.id &&

                            <div key={index} className="message-box" onClick={() => handleSetChat(user)}>
                                <img src={user.picture} alt="profile image" />
                                <div className="message-content">
                                    <div className="message-header">
                                        <div className="name">{user.name}</div>
                                        <div className="star-checkbox">
                                            <input type="checkbox" id="star-1" />
                                            <label htmlFor="star-1">
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
                                                    className="feather feather-star"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="message-line">
                                        I got your first assignment. It was quite good. 🥳 We can continue
                                        with the next assignment.
                                    </p>
                                    <p className="message-line time">Dec, 12</p>
                                </div>
                            </div>

                        ))
                    }

                </div>
            </div>

    )
}
