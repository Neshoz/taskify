import express from "express";
import * as listController from "../controllers/list-controller";

const router = express.Router();

router
  .route("/lists")
  .get(listController.getLists)
  .post(listController.createList);

router
  .route("/lists/:listId")
  .get(listController.getList)
  .put(listController.updateList)
  .delete(listController.deleteList);

export default router;
