import express from "express";
import * as webhookController from "../controllers/webhook-controller";

const router = express.Router();

router
  .route("/webhooks")
  .get(webhookController.getWebhooks)
  .post(webhookController.createWebhook);

router
  .route("/webhooks/:webhookId")
  .get(webhookController.getWebhook)
  .put(webhookController.updateWebhook)
  .delete(webhookController.deleteWebhook);
