const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
    find,
    create,
    editTurees,
    deleteTurees
} = require("./profile.controller");

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
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
}).single("imageName");

router.route('/').get(find).post(upload, create);
// router.get("/", find).post(upload, create);
router.post("/editTurees", editTurees);
router.get("/deleteTurees/:id", deleteTurees);
// router.post("/", upload, create);

module.exports = router;