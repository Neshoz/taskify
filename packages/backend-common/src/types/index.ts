import { Request } from "express";

export interface ApiRequest extends Request {
  userId?: string;
  sessionId?: string;
}
