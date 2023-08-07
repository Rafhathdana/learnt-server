const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const isAuthTutor=require('../../middleware/tutor.auth')
router.route('/create').post(isAuthTutor,upload.single("thumbnail"))