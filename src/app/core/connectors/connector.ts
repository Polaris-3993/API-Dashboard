import { TriggerConnector } from "app/core/connectors/trigger.connector";

export class Connector {
    Id: string;
    Trigger: TriggerConnector;
    LastSync: string;
    IsRemoving: boolean;
    IsRunning: boolean;

    constructor(data) {
        this.Id = data.Id;
        this.Trigger = new TriggerConnector(data);
        this.LastSync = data.LastSync;
        this.IsRemoving = false;
        this.IsRunning = false;
    }
}