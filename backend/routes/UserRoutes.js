"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
//middlewares
const verify_token_1 = __importDefault(require("../helpers/verify-token"));
const image_upload_1 = __importDefault(require("../helpers/image-upload"));
router.post("/register", UserController_1.default.register);
router.post("/login", UserController_1.default.login);
router.get("/checkuser", UserController_1.default.checkUser);
router.get("/:id", UserController_1.default.getUserById);
router.patch("/edit/:id", verify_token_1.default, image_upload_1.default.single("image"), UserController_1.default.editUser);
exports.default = router;
