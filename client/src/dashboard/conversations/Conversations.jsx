import React, { useState, useEffect, useContext } from 'react';
import Conversation from './Conversation';
import { getConversation, getUsers, setConversation } from '../../api/api';
import { AccountContext } from '../../context/AccountProvider';
import userFallback from '../../images/profile-fallback.png';
import { formatDate } from '../../utils/commonUtils';

export default function Conversations() {
    const [chat, setChat] = useState(false);
    const { socket, setActiveUsers, sender, setSender, currentAccount, markMessageAsRead } =
        useContext(AccountContext);

    const [users, setUsers] = useState([]);
    const [latestMessages, setLatestMessages] = useState({});

    const handleSetChat = async (user) => {
        setSender(user);
        setChat(!chat);
        await setConversation({ senderId: user.id, receiverId: currentAccount.id });
    };

    const handleBack = () => {
        setChat(!chat);
        setSender(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            let data = await getUsers();
            setUsers(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        socket?.current.emit('addUser', currentAccount);
        socket?.current.on('getUsers', (users) => {
            setActiveUsers(users);
        });
    }, [currentAccount]);

    useEffect(() => {
        const fetchLatestMessages = async () => {
            const messagesPromises = users.map(async (user) => {
                const convo = await getConversation({ senderId: user.id, receiverId: currentAccount.id });
                return { userId: user.id, message: convo };
            });

            const messages = await Promise.all(messagesPromises);

            // Create an object with userId as key and latest message as value
            const latestMessagesObject = messages.reduce((acc, { userId, message }) => {
                acc[userId] = message;
                return acc;
            }, {});

            setLatestMessages(latestMessagesObject);
        };

        fetchLatestMessages();
    }, [users, chat]);

    return (
        chat ? <Conversation handleBack={handleBack} chat={chat} /> :
            <div className="conversations-container">
                <div className="conversations">
                    {users &&
                        users.map((user, index) => (
                            <div key={index} className="message-box" onClick={() => handleSetChat(user)}>
                                <img src={user.picture} alt="profile image" onError={(e) => (e.target.src = userFallback)} />
                                <div className="message-content">
                                    <div className="message-header">
                                        <h2 className="name">{user.name}</h2>
                                        <div className="star-checkbox">
                                            <input type="checkbox" id={`star-${index}`} />
                                            <label htmlFor={`star-${index}`}>
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

                                    <p className="message-line">{latestMessages[user.id]?.message}</p>
                                    <p className="message-line time">{formatDate(latestMessages[user.id]?.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
    );
}
