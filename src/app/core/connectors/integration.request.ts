import { TriggerSetup } from "app/routes/integration-details/trigger-setup/trigger.setup";
import { ActionSetup } from "app/routes/integration-details/action-setup/action.setup";

export class IntegrationRequest {
    TriggerSetup: TriggerSetup;
    ActionsSetup: ActionSetup[];

    constructor(triggerSetup: TriggerSetup = new TriggerSetup(), actionsSetup: ActionSetup[] = []) {
        this.TriggerSetup = triggerSetup;
        this.ActionsSetup = actionsSetup;
    }

    public getActiveActionSetup(): ActionSetup[] {
        return this.ActionsSetup.length > 0 ? this.ActionsSetup.filter(x => x.Active) : null;
    }

    public removeActionSetup(actionSetup: ActionSetup) {
        const index = this.ActionsSetup.findIndex(x => x.Action.Id == actionSetup.Action.Id);
        this.ActionsSetup.splice(index, 1);
    }

    public anyActionSetupCodeBlockIsEmpty(): boolean {
        return this.ActionsSetup.some(x => x.isEmptyCodeBlock());
    }

    public updateActionSetupCodeBlockByIndex(codeBlock: string, index: number) {
        if (typeof this.ActionsSetup[index] === 'undefined')
            console.log(`Index ${index} does't exists on collection ActionsSetup`)
        else
            this.ActionsSetup[index].CodeBlock = codeBlock;
    }
}