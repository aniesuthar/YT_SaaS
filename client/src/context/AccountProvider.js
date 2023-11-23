import { createContext, useEffect, useRef, useState } from "react";

import { io } from 'socket.io-client';



export const AccountContext = createContext(null);

function AccountProvider({ children }) {

    const [authed, setAuthed] = useState(false);
    const [currentAccount, setCurrentAccount] = useState();
    const [sender, setSender] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [newMessageFlag, setNewMessageFlag] = useState();

    const socket = useRef();

    // const socketURL = "ws://pf-whatsappsocket.onrender.com";
    const socketURL = "ws://localhost:8000/";

    useEffect(() => {
        socket.current = io(socketURL);
        console.log("Socket Server is Running");
    }, [])

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