import { EntityBase } from "../entity";
import { SystemEventType } from "../system";

export interface ApiWebhook extends EntityBase {
  event: SystemEventType;
  url: string;
}
