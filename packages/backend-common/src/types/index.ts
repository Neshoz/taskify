import { Request } from "express";

export interface EntityBase {
  id: string;
  created: string;
  modified: string;
}

export interface ApiRequest extends Request {
  userId?: string;
  sessionId?: string;
}
