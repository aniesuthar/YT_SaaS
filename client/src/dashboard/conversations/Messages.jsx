import React, { useEffect, useRef, useState, useContext } from 'react'
import Message from './Message'
import { getConversation, getMessages, newMessage } from '../../api/api';
import { AccountContext } from '../../context/AccountProvider';
import TypeField from './TypeField';




export default function Messages({conversation}) {

    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [incomingMessage , setIncomingMessage] = useState(null)
    const { sender, currentAccount, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

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
        console.log(message);
        console.log(value);
        socket.current.emit('sendMessage', message);
        await newMessage(message);

        setValue('');
        setNewMessageFlag(prev => !prev);
    }

    

    useEffect(() => {

        socket.current.on('getMessages', (data) => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        });
    }, []);
    
    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
        setMessages(prev => [...prev, incomingMessage]);
    }, [incomingMessage, conversation])



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
    }, [conversation?._id, sender._id, newMessageFlag]);



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
            <TypeField
                sendText={sendText}
                value={value}
                setValue={setValue}
                setFile={setFile}
                file={file}
            />
        </>
    )
}
