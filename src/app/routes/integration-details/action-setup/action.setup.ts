import { App } from "app/core/apps/app";
import { AppKeyCaption } from "app/core/apps/AppKeyCaption";
import { CredentialKey } from "app/core/apps/credential.key";
import { Trigger } from "app/core/triggers/trigger";
import { Action } from "app/core/actions/action";
import * as _ from "lodash"

export class ActionSetup {
    UserName: string;
    Password: string;
    App: App;
    Action: Action;
    AppKeyCaption: AppKeyCaption;
    CredentialsKey: CredentialKey;
    CodeBlock: string;
    Active?: boolean;
    CustomClass: string;

    constructor(active: boolean = true) {
        this.Active = active;
        this.CustomClass = 'customClass';
        this.CodeBlock = "";
    }

    public isEmptyAction(): boolean {
        return _.isEmpty(this.Action);
    }

    public isEmptyCodeBlock(): boolean {
        return !_.trim(this.CodeBlock) ? true : false;
    }
}
