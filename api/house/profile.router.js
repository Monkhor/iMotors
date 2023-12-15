const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
    find,
    create,
    editTurees,
    deleteTurees
} = require("./profile.controller");
const {
    getByIdHouse
} = require("./profile.service");

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
        }
        cb(null, true);
    },
}).single("imageName");

const deleteImageMiddleware = async (req, res, next) => {
    const houseId = req.params.id;
    try {
        getByIdHouse(houseId, (err, results) => {
            if (err || !results || results.length === 0) {
                console.error("Image not found or error:", err);
                return next();
            }
            const imageName = results[0].imageName;
            const imagePath = path.join('./upload/images', imageName);
            fs.unlink(imagePath, (unlinkError) => {
                if (unlinkError) {
                    console.error("Error deleting image:", unlinkError);
                }
                next();
            });
        });
    } catch (error) {
        console.error("Error retrieving image:", error);
        next();
    }
};


router.route('/').get(find).post(upload, create);
// router.post("/editTurees", editTurees);
router.route("/editTurees").post(editTurees);
// router.get("/deleteTurees/:id", deleteImageMiddleware, deleteTurees);
router.route("/deleteTurees/:id").get(deleteImageMiddleware,deleteTurees);

module.exports = router;