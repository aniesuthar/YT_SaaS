import { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import { getUsers } from "../api/api";

export const AccountContext = createContext(null);

function AccountProvider({ children }) {
    const [authed, setAuthed] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [sender, setSender] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [newMessageFlag, setNewMessageFlag] = useState();
    const [notification, setNotification] = useState([]);

    const socket = useRef(null);

    const socketURL = "ws://localhost:8009/";

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(socketURL, {
                transports: ['websocket'],
            });
            console.log("Socket Server is Running CLIENTSIDE");
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, []);

    const [unreadMessages, setUnreadMessages] = useState([]);

    const markMessageAsRead = (messageId) => {
        setUnreadMessages((prev) => prev.filter((message) => message._id !== messageId));
    };
    
    const showBrowserNotification = (title, options) => {
        if (Notification.permission === 'granted') {
            new Notification(title, options);
        }
    };

    useEffect(() => {
        socket?.current.on('getMessage', async (data) => {
            setUnreadMessages((prev) => [...prev, data]);
            
            showBrowserNotification(`New Message`, {
                body: data.text
            });
        });


    }, []);
    console.log(unreadMessages, "---Notification---");

    return (
        <AccountContext.Provider value={{
            authed,
            setAuthed,
            currentAccount,
            setCurrentAccount,
            sender,
            setSender,
            socket,
            activeUsers,
            setActiveUsers,
            newMessageFlag,
            setNewMessageFlag,
            notification,
            setNotification,
            unreadMessages,
            setUnreadMessages,
            markMessageAsRead,
            showBrowserNotification
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider;