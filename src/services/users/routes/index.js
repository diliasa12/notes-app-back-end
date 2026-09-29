import { Router } from "express";
import { validate } from "../../../middlewares/validate.js";
import { userPayloadSchema } from "../validator/schema.js";
import { createUser, getUserById } from "../controller/user-controller.js";

const routes = Router();
routes.post("/users", validate(userPayloadSchema), createUser);
routes.get("/users/:id", getUserById);
export default routes;
