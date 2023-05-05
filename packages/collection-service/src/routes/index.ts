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

router
  .route("/lists/:listId/users")
  .get(listController.getListUsers)
  .post(listController.addUserToList);

router
  .route("/lists/:listId/users/:userId")
  .put(listController.updateListUser)
  .delete(listController.deleteUserFromList);

router
  .route("/lists/:listId/tasks")
  .get(taskController.getTasks)
  .post(taskController.createTask);

router
  .route("/lists/:listId/tasks/:taskId")
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
