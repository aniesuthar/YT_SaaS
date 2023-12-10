const User = require('../modal/UserModal');


async function getCurrentUser(req, res) {
    return res.send(res.locals.user);
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user._id } });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getUsers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getCurrentUser,
    getUsers
}