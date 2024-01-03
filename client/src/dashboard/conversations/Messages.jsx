import React, { useEffect, useRef, useState, useContext } from 'react'
import Message from './Message'
import { getMessages } from '../../api/api';
import { AccountContext } from '../../context/AccountProvider';




export default function Messages({conversation}) {

    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [incomingMessage , setIncomingMessage] = useState(null)
    const { sender, socket, newMessageFlag, notification, setNotification } = useContext(AccountContext);

    

    useEffect(() => {
        socket.current.on('getMessage', data => {            
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        })
    }, []);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) &&
            setMessages(prev => [...prev, incomingMessage]);

            //give notification

            setNotification([incomingMessage, ...notification]);
            
        }, [incomingMessage, conversation])
        
        
        console.log(notification);

    useEffect(() => {
        const getMessageDetails = async () => {
            // console.log("getMessagesDetails convo: ", conversation);
            let data = await getMessages(conversation?._id);
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation._id, sender._id, newMessageFlag]);



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: "smooth" })
    }, [messages]);


    return (
        <>
            <div className="messages">
                <div className="messages-container">
                    {messages && messages.map((message, index) => (
                        <div ref={scrollRef} key={index}>
                            <Message message={message} />
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    )
}
