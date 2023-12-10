import axios from 'axios';

// Set default configuration for all requests
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const getUsers = async () => {
    try {
        let response = await axios.get('/users');
        return response.data;
    } catch (error) {
        console.log('Error while calling getUsers API ', error.message);
    }
}

export const isAuthed = async () => {
    try {
        let response = await axios.get('/addUser');
        return response.data;
    } catch (error) {
        console.log('Error while calling isAuthed API ', error.message);
    }
}

export const setConversation = async (data) => {
    try {
        await axios.post('/conversation/add', data);
    } catch (error) {
        console.log('Error while calling setConversation API ', error.message);
    }
}

export const getConversation = async (data) => {
    try {
        let response = await axios.post('/conversation/get', data);
        return response.data;
    } catch (error) {
        console.log('Error while calling getConversation API ', error);
    }
}

export const newMessage = async (data) => {
    try {
        await axios.post('/message/add', data);
    } catch (error) {
        console.log('Error while calling newMessage API ', error);
    }
}

export const getMessages = async (id) => {
    try {
        let response = await axios.get(`/message/get/${id}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getMessages API ', error);
    }
}

export const logout = async () => {
    try {
        let response = await axios.get('/logout');
        return response.data;
    } catch (error) {
        console.log('Error while calling logout API ', error.message);
    }
}
