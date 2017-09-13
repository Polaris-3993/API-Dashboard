import { App } from "app/core/apps/app";
import { AppKeyCaption } from "app/core/apps/appKeyCaption";
import { CredentialKey } from "app/core/apps/credential.key";
import { Trigger } from "app/core/triggers/trigger";
import * as _ from "lodash"

export class TriggerSetup {
    UserName: string;
    Password: string;
    App: App;
    Trigger: Trigger;
    AppKeyCaption: AppKeyCaption;
    CredentialsKey: CredentialKey;

    public isEmptyTrigger(): boolean {
        return _.isEmpty(this.Trigger);
    }
}
