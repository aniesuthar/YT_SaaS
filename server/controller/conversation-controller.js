const Conversation = require("../modal/ConversationModal");

module.exports.newConversation = async (request, response) => {
    try {
        const senderId = request.body.senderId;
        const receiverId = request.body.receiverId;

        const exist = await Conversation.findOne({ members: { $all: [receiverId, senderId] } });

        if (exist) {
            response.status(200).json('conversation already exists');
            return;
        }

        const newConversation = new Conversation({
            members: [senderId, receiverId]
        });
        await newConversation.save();
        return response.status(200).json('conversation saved successfully');
    } catch (error) {
        
        return response.status(500).json(error.message);
    }

}

module.exports.getConversation = async (request, response) => {
    try {
        let conversation = await Conversation.findOne({ members: { $all: [request.body.receiverId, request.body.senderId] } });
        response.status(200).json(conversation);

    } catch (error) {
        response.status(500).json(error.message);
    }
}