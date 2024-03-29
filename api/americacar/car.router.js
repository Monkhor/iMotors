const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
    findAll,
    create,
    editCar,
    sellCar,
    zarlaga,
    getZarlaga,
    deleteCar,
    createNoImage
} = require("./car.controller");
const {
    getByIdCar
} = require("./car.service");





const storage = multer.diskStorage({
    destination: './upload/car',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadMultiple = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
        }
        cb(null, true);
    },
}).array("imageName", 8);

const deleteImageMiddleware = async (req, res, next) => {
    const carId = req.params.id;
    try {
        getByIdCar(carId, (err, results) => {
            if (err || !results || results.length === 0) {
                console.error("Image not found or error:", err);
            } else {
                for (let i = 0; i < results.length; i++) {
                    const imagePath = path.join('./upload/car', results[i].imageName);
                    fs.unlink(imagePath, (unlinkError) => {
                        if (unlinkError) {
                            console.error("Error deleting image:", unlinkError);
                        }
                    });
                }
            }
            next();
        });
    } catch (error) {
        console.error("Зураг устгахад алдаа:", error);
    }
};

router.route('/').get(findAll);
router.route('/createCarMulti').post(uploadMultiple, create);
router.route('/createCarNoImage').post(createNoImage);
router.post("/sell", sellCar);
router.get("/getZarlaga/:id", getZarlaga);
router.post("/editCar", editCar);
router.post("/zarlaga", zarlaga);
router.get("/deleteCar/:id", deleteImageMiddleware, deleteCar);
module.exports = router;
