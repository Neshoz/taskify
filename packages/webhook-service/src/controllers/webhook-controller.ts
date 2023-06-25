import { ApiRequest } from "@taskify/backend-common";
import { NextFunction, Response } from "express";

export async function getWebhooks(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {}

export async function createWebhook(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {}

export async function getWebhook(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {}

export async function updateWebhook(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {}

export async function deleteWebhook(
  req: ApiRequest,
  res: Response,
  next: NextFunction
) {}
