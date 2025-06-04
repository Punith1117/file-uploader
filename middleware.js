function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next()
    res.status(401).render('unauthenticated')
}

module.exports = { isAuthenticated }