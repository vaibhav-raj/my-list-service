import { Router } from "express";
import { container } from "tsyringe";
import validate from "../../middlewares/validate.middleware";
import {
    addToMyListSchema,
    removeFromMyListSchema,
    getMyListSchema,
} from "./validators/mylist.validator";
import { MyListController } from "./mylist.controller";
import { initializeMyListModule } from "./index";

const myListRouter = Router();

// Make sure dependencies are registered before resolving the controller
initializeMyListModule();

// Resolve controller through tsyringe container
const controller = container.resolve(MyListController);

// Routes with validation
myListRouter.post(
    "/addToMyList",
    validate(addToMyListSchema),
    controller.addToMyList
);
myListRouter.get(
    "/",
    controller.getMyList
);
myListRouter.delete(
    "/",
    validate(removeFromMyListSchema),
    controller.removeFromMyList
);

export default myListRouter;
