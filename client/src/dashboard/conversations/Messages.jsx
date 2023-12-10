import React, { useEffect, useRef, useState, useContext } from 'react'
import Message from './Message'
import { getMessages } from '../../api/api';
import { AccountContext } from '../../context/AccountProvider';




export default function Messages({conversation}) {

    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [incomingMessage , setIncomingMessage] = useState(null)
    const { sender, socket, newMessageFlag } = useContext(AccountContext);

    

    useEffect(() => {

        socket.current.on('getMessages', (data) => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        });
    }, [, newMessageFlag]);
    
    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
        setMessages(prev => [...prev, incomingMessage]);
    }, [incomingMessage, conversation, newMessageFlag])



    useEffect(() => {
        const getMessageDetails = async () => {
            console.log("getMessagesDetails convo: ", conversation);
            let data = await getMessages(conversation?._id);
            setMessages(data);
            console.log("getMessages:", data);

            // socket.current.on('getMessages', (data) => {
            //     // Update your React state or UI with the progress data
            //     setMessages(data);
            // });
        }
        getMessageDetails();
    }, [conversation, sender, newMessageFlag]);



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
