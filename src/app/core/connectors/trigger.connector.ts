export class TriggerConnector {
    Name: string;
    ActionNames: string[];

    constructor(data) {
        const trigger = JSON.parse(data.Name)
        this.Name = trigger.TriggerName;
        this.ActionNames = trigger.ActionNames;
  }
}