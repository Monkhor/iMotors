const {
    findAll,
    create,
    editCar,
    sellCar,
    zarlaga,
    getZarlaga,
    deleteCar,
    uploadImage
} = require("./car.service");

module.exports = {
    findAll: (req, res) => {
        try {
            findAll((err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай",
                    data: results
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    getZarlaga: (req, res) => {
        const id = req.params.id
        try {
            getZarlaga(id, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "error!",
                        data: null
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай",
                    data: results
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    create: (req, res) => {
        try {
            var data = req.body;
            var imageNames = req.files.map(file => file.filename);
            create(data, (err, resultsIda) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "DB error!"
                    })
                }
                if (req.file && req.files.length < 2) {
                    data["imageName"] = req.file.filename;
                    var imageData = { imageName: data.imageName, ida: resultsIda };
                    uploadImage(imageData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                } else {
                    for (let i = 0; i < req.files.length; i++) {
                        var imageData = { imageName: imageNames[i], ida: resultsIda };
                        uploadImage(imageData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай бүртгэлээ"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    createNoImage: (req, res) => {
        try {
            var data = req.body;
            create(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "DB error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай бүртгэлээ"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    editCar: (req, res) => {
        try {
            var data = req.body;
            editCar(data, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    sellCar: (req, res) => {
        try {
            var data = req.body;
            sellCar(data, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    zarlaga: (req, res) => {
        try {
            var data = req.body;
            zarlaga(data, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "DB error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай бүртгэлээ"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    },
    deleteCar: (req, res) => {
        const id = req.params.id
        try {
            deleteCar(id, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "error!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Алдаа DB!"
            });
        }
    }
};