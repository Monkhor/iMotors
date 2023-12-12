const {
    find,
    create,
    editTurees,
    deleteTurees
} = require("./profile.service");

module.exports = {
    find: (req, res) => {
        try {
            find((err, results) => {
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
            if (req.file)
                data["imageName"] = req.file.filename;
            create(data, (err, results) => {
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
    editTurees: (req, res) => {
        try {
            var data = req.body;
            editTurees(data, (err, results) => {
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
    deleteTurees: (req, res) => {
        const id = req.params.id
        try {
            deleteTurees(id, (err, results) => {
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