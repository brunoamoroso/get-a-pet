import express from "express";
import cors from "cors";

import UserRoutes from './routes/UserRoutes';
import PetRoutes from './routes/PetRoutes';

const app = express();

//Config Json Response
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//Public folder for images
app.use(express.static("public"));

//Routes
app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);

app.listen(5001);