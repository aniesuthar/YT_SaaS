import { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

export const AccountContext = createContext(null);

function AccountProvider({ children }) {
    const [authed, setAuthed] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [sender, setSender] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [newMessageFlag, setNewMessageFlag] = useState();

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
    }, [socket]);

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
            setNewMessageFlag
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider;