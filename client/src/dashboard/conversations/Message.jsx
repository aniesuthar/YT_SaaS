import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../../context/AccountProvider';
import { downloadMedia, formatDate } from '../../utils/commonUtils.js';
import iconPDF from '../../icons/pdfIcon.png'
import { getFromS3 } from '../../api/api.js';

export default function Message({ message }) {
    const { sender } = useContext(AccountContext);


    return (
        sender.id === message.senderId ?
            <div className='mssg own'>
                {
                    message.type === 'file' ? <FileMessage message={message} /> : <TextMessage message={message} />
                }
            </div>
            :
            <div className='mssg'>
                {
                    message.type === 'file' ? <FileMessage message={message} /> : <TextMessage message={message} />
                }
            </div>
    )
}

const TextMessage = ({ message }) => {

    return (
        <>
            {message.text} <span className='timestamp'>{formatDate(message.createdAt)}</span>
        </>
    )
}

const FileMessage = ({ message }) => {

    const [fileSrc, setFileSrc] = useState('');

    useEffect(() => {
        // Fetch the image content from S3 when the component mounts for messages of type 'file'
        if (message.type === 'file') {
            const fetchFileFromS3 = async () => {
                try {
                    const response = await getFromS3(message.text);

                    setFileSrc(`http://localhost:5000/getfile-S3/${message.text}`);
                } catch (error) {
                    console.error('Error fetching image from S3:', error);
                }
            };

            fetchFileFromS3();
        }
    }, [message.type, message.text]);

    return (
        <div>
            {
                message?.text?.includes('.pdf') ?
                    <div style={{ display: 'flex' }}>
                        <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
                        <p style={{ fontSize: 14 }} >{message.text.split("/").pop()}</p>
                    </div>
                    :
                    message?.text?.includes('.mp4') ?   
                        <video style={{ width: 300, height: '100%', objectFit: 'cover' }} src={fileSrc} controls></video>
                        :
                        <img style={{ width: 300, height: '100%', objectFit: 'cover' }} src={fileSrc} />
            }
            <p style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <img
                    onClick={(e) => downloadMedia(e, message.text)}
                    fontSize='small'
                    style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }}
                />
            </p>
            {/* <p>{message.text}</p> */}
            <span className='timestamp'>{formatDate(message.createdAt)}</span>
        </div>
    )
}
