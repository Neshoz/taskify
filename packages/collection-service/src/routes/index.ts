import express from "express";
import * as listController from "../controllers/list-controller";
import * as taskController from "../controllers/task-controller";

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

router.route("/lists/:listId/tasks").get(taskController.getTasks);

export default router;
