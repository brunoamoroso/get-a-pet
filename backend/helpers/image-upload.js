"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
//destination to store the images
const imgStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";
        console.log(req);
        if (req.baseUrl.includes("users")) {
            folder = "users";
        }
        else if (req.baseUrl.includes("pets")) {
            folder = "pets";
        }
        cb(null, `public/imgs/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +
            String(Math.floor(Math.random() * 1000)) +
            path_1.default.extname(file.originalname));
    },
});
const imageUpload = (0, multer_1.default)({
    storage: imgStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png!"));
        }
        cb(null, true);
    },
});
exports.default = imageUpload;
