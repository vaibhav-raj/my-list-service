import { Router } from "express";
import myListRouter from "../modules/myList/mylist.route";
const router = Router();

router.use("/mylist", myListRouter);

export default router;