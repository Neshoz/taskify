import { EntityBase } from "../entity";

export interface ApiSession {
  userId: string;
  sessionId: string;
}

export interface ApiUser extends EntityBase {
  email: string;
}
