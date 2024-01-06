const Notification = require("../modal/NotificationModal");

const createNotification = async (userId, message) => {
    try {
        const notification = new Notification({
            userId,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};



module.exports = {
    createNotification
}