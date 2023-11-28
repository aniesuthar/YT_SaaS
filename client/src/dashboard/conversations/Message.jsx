import React, {useContext} from 'react'
import { AccountContext } from '../../context/AccountProvider';
import { formatDate } from '../../utils/commonUtils.js';

export default function Message({message}) {
    const { sender } = useContext(AccountContext);
  return (
              sender.id === message.senderId ?
                  <p  className='own'>
                      {
                          message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
                      }
                  </p>
                  :
                  <p>
                      {
                          message.type === 'file' ? <ImageMessage message={message} /> : <TextMessage message={message} />
                      }
                  </p>
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

    return
//         <div style={{ position: 'relative' }}>
//             {
//                 message?.text?.includes('.pdf') ?
//                     <div style={{ display: 'flex' }}>
//                         <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
//                         <p style={{ fontSize: 14 }} >{message.text.split("/").pop()}</p>
//                     </div>
//                     :
//                     <img style={{ width: 300, height: '100%', objectFit: 'cover' }} src={message.text} alt={message.text} />
//             }
//             <p style={{ position: 'absolute', bottom: 0, right: 0 }}>
//                 <img
//                     onClick={(e) => downloadMedia(e, message.text)}
//                     fontSize='small'
//                     style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }}
//                 />
//                 {formatDate(message.createdAt)}
//             </p>
//         </div>

}
