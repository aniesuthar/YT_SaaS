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
                    message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
                }
            </div>
            :
            <div className='mssg'>
                {
                    message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
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

const ImageMessage = ({ message }) => {

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        // Fetch the image content from S3 when the component mounts for messages of type 'file'
        if (message.type === 'file') {
            const fetchImageFromS3 = async () => {
                try {
                    const response = await getFromS3(message.text);

                    setImageSrc(`http://localhost:5000/getfile-S3/${message.text}`);
                } catch (error) {
                    console.error('Error fetching image from S3:', error);
                }
            };

            fetchImageFromS3();
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
                        <video class="f804f6gw ln8gz9je ppled2lx K13VR" controls="" controlslist="nodownload nofullscreen" src="blob:https://web.whatsapp.com/942aa292-953c-49de-8add-ed64d8dc40a4"></video>
                        :
                        <img style={{ width: 300, height: '100%', objectFit: 'cover' }} src={imageSrc} />
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
