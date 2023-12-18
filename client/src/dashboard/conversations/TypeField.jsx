import { useEffect, useState } from 'react';
import { uploadToS3 } from '../../api/api';

const TypeField = ({ sendMssg, setValue, value, setFile, file }) => {

    const [previewURL, setPreviewURL] = useState();

    useEffect(() => {
        const getFile = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
                // setPreviewURL(URL.createObjectURL(file));

                const response = await uploadToS3(data);
                setFile(response.data);
            } else {
                return "No files selected/uploaded yet!";
            }
        }
        getFile();
    }, [file])

    console.log(file);

    const onFileChange = (e) => {
        setValue(e.target.files[0].name);
        setFile(e.target.files[0]);
    }

    return (
        <form className='type-message'>

            <div className="file-input" title='Select Video/Image files'>
                <input
                    type='file'
                    id="fileInput"
                    name='file'
                    onChange={(e) => onFileChange(e)}
                    accept="image/*, video/*"
                />
                <label htmlFor="fileInput" class="fileBtn">
                    <span>+</span>
                </label>
            </div>
            {/* {file &&
                <PreviewContainer>
                    <img src={previewURL} alt="preview" title="Your file input" style={{ maxHeight: "100%" }} />
                    <button onClick={(e) => sendMedia(e)}><SendIcon /></button>
                </PreviewContainer>} */}
            <input
                placeholder="Type a message..."
                InputProps={{ 'aria-label': 'search' }}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <button onClick={(e) => sendMssg(e)} title= {file ? "SendFile" : "SendTextMssg"}>Send</button>

        </form>
    )
}

export default TypeField;