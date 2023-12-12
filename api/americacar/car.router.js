const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
    findAll,
    create,
    editCar,
    sellCar,
    zarlaga,
    getZarlaga,
    deleteCar
} = require("./car.controller");

const storage = multer.diskStorage({
    destination: './upload/car',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            // return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single("imageName");

router.route('/').get(findAll).post(upload, create);
router.post("/sell", sellCar);
router.get("/getZarlaga/:id", getZarlaga);
router.post("/editCar", editCar);
router.post("/zarlaga", zarlaga);
router.get("/deleteCar/:id", deleteCar);
module.exports = router;