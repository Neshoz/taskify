import express from "express";
import * as listController from "../controllers/list-controller";
import * as taskController from "../controllers/task-controller";

const router = express.Router();

router
  .route("/collections")
  .get(listController.getLists)
  .post(listController.createList);

router
  .route("/collections/:listId")
  .get(listController.getList)
  .put(listController.updateList)
  .delete(listController.deleteList);

router
  .route("/collections/:listId/users")
  .get(listController.getListUsers)
  .post(listController.addUserToList);

router
  .route("/collections/:listId/users/:userId")
  .put(listController.updateListUser)
  .delete(listController.deleteUserFromList);

router
  .route("/collections/:listId/tasks")
  .get(taskController.getTasks)
  .post(taskController.createTask);

router
  .route("/collections/:listId/tasks/:taskId")
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
