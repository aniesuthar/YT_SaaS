const requireUser = (req, res, next) => {
    // console.log({res});
    const user = res.locals.user;

    if (!user) {
        return res.sendStatus(403);
    }

    return next();
};

module.exports = requireUser;