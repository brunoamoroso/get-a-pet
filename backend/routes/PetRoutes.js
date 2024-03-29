"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PetController_1 = __importDefault(require("../controllers/PetController"));
const router = express_1.default.Router();
//middllewares
const verify_token_1 = __importDefault(require("../helpers/verify-token"));
const image_upload_1 = __importDefault(require("../helpers/image-upload"));
router.post("/create", verify_token_1.default, image_upload_1.default.array("images"), PetController_1.default.create);
router.get("/", PetController_1.default.getAll);
router.get("/mypets", verify_token_1.default, PetController_1.default.getAllUserPets);
router.get("/myadoptions", verify_token_1.default, PetController_1.default.getAllUserAdoptions);
router.get("/:id", PetController_1.default.getPetById);
router.delete("/:id", verify_token_1.default, PetController_1.default.removePetById);
router.patch("/:id", verify_token_1.default, image_upload_1.default.array('images'), PetController_1.default.updatePet);
router.patch("/schedule/:id", verify_token_1.default, PetController_1.default.schedule);
router.patch("/conclude/:id", verify_token_1.default, PetController_1.default.concludeAdoption);
exports.default = router;
