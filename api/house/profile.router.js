const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
    getAll,
    createHouse,
    editHouse,
    getTrent,
    createTrent,
    deleteTrent,
    editTrent,
    deleteMonth,
    createMonth,
    editMonth,
    createNoImageTrent,
    getMonth,
    leftHouse
} = require("./profile.controller");
const {
    getByIdTrent
} = require("./profile.service");

const storage = multer.diskStorage({
    destination: './upload/images',
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
    const houseId = req.params.id;
    try {
        getByIdTrent(houseId, (err, results) => {
            if (err || !results || results.length === 0) {
                console.error("Image not found or error:", err);
            } else {
                for (let i = 0; i < results.length; i++) {
                    const imagePath = path.join('./upload/images', results[i].imageName);
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

// router.route('/deleteHouse/:id').get(deleteImageMiddleware, deleteHouse); DELETE  function ashiglahgui
//Байшингийн ерөнхий мэдээлэл
router.route('/').get(getAll).post(createHouse);
router.route('/editHouse').post(editHouse);
router.route('/leftHouse/:idh/:idt').get(leftHouse);
//Түрээслэсэн түүх болон мэдээлэл
router.route('/trentSingle/:idh').get(getTrent);
// router.route('/trentSingle').post(upload, createTrent);
router.route('/trentMultiple').post(uploadMultiple, createTrent);  //Зурагтай хадгалах
router.route('/trentNoImage').post(createNoImageTrent); //Зураггүй хадгалах
router.route('/deleteTrent/:id').get(deleteImageMiddleware, deleteTrent);
router.route('/editTrent').post(editTrent);
//Сарын түрээсийн түүх болон мэдээлэл
router.route('/deleteMonth/:idt/:idh').get(deleteMonth);
router.route('/createHouseMonth').post(createMonth);
router.route('/editHouseMonth').post(editMonth);
router.route('/getMonth').post(getMonth);
module.exports = router;