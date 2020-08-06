import express from "express";
import ClassesController from "./src/controllers/classesControllers";
import ConnectionsControllers from "./src/controllers/ConnectionsControllers";
const routes = express.Router();

const classesControllers = new ClassesController;
const connectionsControllers = new ConnectionsControllers;

routes.get("/classes", classesControllers.index);
routes.post("/classes", classesControllers.create);

routes.get("/connections", connectionsControllers.index);
routes.post("/connections", connectionsControllers.create);

export default routes;