import { Component, OnInit, Input } from '@angular/core';
import { ModalDirective, BsModalRef } from "ngx-bootstrap/modal";
import { IntegrationDetailsService } from "app/core/integration-details/integration-details.service";
import { Action } from "app/core/actions/action";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { App } from "app/core/apps/app";
import { CredentialKey } from "app/core/apps/credential.key";
import { AppKeyCaption } from "app/core/apps/appKeyCaption";
import { Observable } from "rxjs/Rx";
import { AppsService } from "app/core/apps/apps.service";
import { ActionsService } from "app/core/actions/actions.service";
import { ActionSetup } from "app/routes/integration-details/action-setup/action.setup";

@Component({
  selector: 'app-action-setup',
  templateUrl: './action-setup.component.html',
  styleUrls: ['./action-setup.component.scss'],
  providers: [ActionsService, AppsService]
})
export class ActionSetupComponent implements OnInit {
  public title: string;
  public currentActionSetup: ActionSetup = new ActionSetup();
  public apps: App[] = [];
  public actions: Action[] = [];
  public selectedAppName: string;
  public selectedActionName: string;

  public credentialsKeys: CredentialKey[];
  public appKeyCaption: AppKeyCaption;
  public selectedCredentialKey: CredentialKey;
  public showBusy: boolean;

  private _appId: string;

  get appId(): string {
    return this._appId;
  }

  @Input()
  set appId(appId: string) {
    console.log(`New appId in setter ${appId}`)

    this._appId = appId;
    if (appId)
      this.LoadKeysAndActions(this.appId);
  }

  constructor(public bsModalRef: BsModalRef,
    private integrationDetailsService: IntegrationDetailsService,
    private actionsService: ActionsService,
    private appsService: AppsService) { }

  ngOnInit() {
    this.showBusy = false;
  }

  public saveAction() {
    this.currentActionSetup.AppKeyCaption = this.appKeyCaption;
    this.currentActionSetup.CredentialsKey = this.selectedCredentialKey;
    if (this.selectedCredentialKey == null && this.appKeyCaption != null) {
      console.log('CREATE_APPKEYCAPTION_START.')
      this.appsService.createAppKeyCaption(this.currentActionSetup.App.Id, this.appKeyCaption)
        .subscribe(response => {
          this.appKeyCaption.AppKeysId = response.json() as string; // appKeysId
          this.integrationDetailsService.saveAction(this.currentActionSetup);
        },
        error => console.log('Error: ' + error),
        () => console.log('CREATE_APPKEYCAPTION_SUCCESS.'));
    } else {
      this.integrationDetailsService.saveAction(this.currentActionSetup);
    }
  }

  public onAppSelect(e: TypeaheadMatch): void {
    const selectedApp = e.item as App;
    if (selectedApp == null)
      return

    this.appKeyCaption = null;
    this.credentialsKeys = null;
    this.selectedActionName = null;
    this.selectedCredentialKey = null;

    this.currentActionSetup.App = selectedApp;

    this.LoadKeysAndActions(selectedApp.Id);

    console.log('Selected app: ', selectedApp);
  }

  public onActionSelect(e: TypeaheadMatch): void {
    const selectedAction = e.item as Action;
    if (selectedAction == null)
      return

    this.integrationDetailsService.actionSelected(selectedAction);

    this.currentActionSetup.Action = selectedAction;

    console.log('Selected action: ', selectedAction);

    this.actionsService.getTemplateById(selectedAction.Id).subscribe(
      result => {
        this.currentActionSetup.CodeBlock = result;
      });
  }

  private LoadKeysAndActions(appId: string) {
    console.log('LOAD_ACTIONS_START AND LOAD_KEYS_START.')

    this.showBusy = true;

    Observable.forkJoin(
      this.appsService.getKeysByAppId(appId),
      this.actionsService.getAllByAppId(appId)
    ).subscribe(
      result => {
        this.credentialsKeys = result[0];
        this.actions = result[1];
        this.showBusy = false;

        if (result === undefined || result[0].length === 0) {
          this.appsService.getAppKeyCaptionsById(appId).subscribe( sresult => {
              this.appKeyCaption = sresult;
            }, error => console.log('Error: ' + error),
            () => console.log(`Loading app key captions by appId ${appId} completed.`))
        }
        else {
          if (this.selectedCredentialKey != null) {
            this.selectedCredentialKey = this.credentialsKeys.find(x => x.Id == this.selectedCredentialKey.Id);
          }
          else {
            this.selectedCredentialKey = this.credentialsKeys[0];
          }
        }
      },
      error => {
        this.showBusy = false;
        console.log('Error: ' + error)
      },
      () => console.log('LOAD_ACTIONS_SUCCESS AND LOAD_KEYS_SUCCESS.')
      );
  }

}
