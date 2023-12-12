const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
        status: 0,
        message: err.message
    })
}
module.exports = errorHandler;