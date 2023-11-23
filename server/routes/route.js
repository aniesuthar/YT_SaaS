const express = require('express');

const { fetchChannels } = require('../controller/channels-controller');
const { login, googleCallback, getUser, isAuthed, logout} = require('../controller/login-controller');
const { YTupload } = require('../controller/YTupload-controller');
const { newConversation, getConversation } = require('../controller/conversation-controller');
const { newMessage, getMessages } = require('../controller/message-controller');



const route = express.Router();




route.get('/login', login);
route.get('/logout', logout);
route.get('/auth/google/callback', googleCallback);

route.get('/authed', isAuthed);
route.get('/users', getUser);

route.post('/conversation/add', newConversation);
route.post('/conversation/get', getConversation);

route.post('/message/add', newMessage);
route.get('/message/get/:id', getMessages);

route.get('/get-channel-info', fetchChannels);
route.post('/upload', YTupload);


module.exports = route;