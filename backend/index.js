"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const PetRoutes_1 = __importDefault(require("./routes/PetRoutes"));
const app = (0, express_1.default)();
//Config Json Response
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Solve CORS
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
//Public folder for images
app.use(express_1.default.static("public"));
//Routes
app.use("/users", UserRoutes_1.default);
app.use("/pets", PetRoutes_1.default);
app.listen(5001);
