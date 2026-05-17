import { Router } from "express";
import productRoutes from "./products.routes";
import userRoutes from "./user.routes";

const routes = Router();

routes.use("/products", productRoutes);

export default routes;