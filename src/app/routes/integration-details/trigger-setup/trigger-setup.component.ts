import { Component, OnInit, Input } from '@angular/core';
import { ModalDirective, BsModalRef } from "ngx-bootstrap/modal";
import { IntegrationDetailsService } from "app/core/integration-details/integration-details.service";
import { App } from "app/core/apps/app";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { TriggersService } from "app/core/triggers/triggers.service";
import { Trigger } from "app/core/triggers/trigger";
import { AppsService } from "app/core/apps/apps.service";
import { Observable } from "rxjs/Rx";
import { AppKeyCaption } from "app/core/apps/appKeyCaption";
import { CredentialKey } from "app/core/apps/credential.key";
import { TriggerSetup } from "app/routes/integration-details/trigger-setup/trigger.setup";

@Component({
  selector: 'app-trigger-setup',
  templateUrl: './trigger-setup.component.html',
  styleUrls: ['./trigger-setup.component.scss'],
  providers: [TriggersService, AppsService]
})
export class TriggerSetupComponent implements OnInit {
  public title: string;
  public currentTriggerSetup: TriggerSetup = new TriggerSetup();
  public apps: App[] = [];
  public triggers: Trigger[] = [];
  public selectedAppName: string;
  public selectedTriggerName: string;
  public isFirstUsing: boolean;

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
      this.LoadKeysAndTriggers(this.appId);
  }

  constructor(public bsModalRef: BsModalRef,
    private integrationDetailsService: IntegrationDetailsService,
    private triggersService: TriggersService,
    private appsService: AppsService) { }

  ngOnInit() {
    this.showBusy = false;
  }

  public saveTrigger() {
    this.currentTriggerSetup.AppKeyCaption = this.appKeyCaption;
    this.currentTriggerSetup.CredentialsKey = this.selectedCredentialKey;
    if (this.selectedCredentialKey == null && this.appKeyCaption != null) {
      console.log('CREATE_APPKEYCAPTION_START.')
      this.appsService.createAppKeyCaption(this.currentTriggerSetup.App.Id, this.appKeyCaption)
        .subscribe(response => {
          this.appKeyCaption.AppKeysId = response.json() as string; // appKeysId
          this.integrationDetailsService.saveTrigger(this.currentTriggerSetup);
        },
        error => console.log('Error: ' + error),
        () => console.log('CREATE_APPKEYCAPTION_SUCCESS.'));
    } else {
      this.integrationDetailsService.saveTrigger(this.currentTriggerSetup);
    }
  }

  public onAppSelect(e: TypeaheadMatch): void {
    let selectedApp = e.item as App;
    if (selectedApp == null)
      return

    this.integrationDetailsService.appSelected(selectedApp);

    this.appKeyCaption = null;
    this.credentialsKeys = null;
    this.selectedTriggerName = null;
    this.selectedCredentialKey = null;

    this.currentTriggerSetup.App = selectedApp;
    this.currentTriggerSetup.Trigger = null;

    this.LoadKeysAndTriggers(selectedApp.Id);

    console.log('Selected app: ', selectedApp);
  }

  public onTriggerSelect(e: TypeaheadMatch): void {
    const selectedTrigger = e.item as Trigger;
    if (selectedTrigger == null)
      return

    this.integrationDetailsService.triggerSelected(selectedTrigger);

    this.currentTriggerSetup.Trigger = selectedTrigger;

    console.log('Selected trigger: ', selectedTrigger);
  }

  private LoadKeysAndTriggers(appId: string) {
    console.log('LOAD_TRIGGERS_START AND LOAD_KEYS_START.')

    this.showBusy = true;

    Observable.forkJoin(
      this.appsService.getKeysByAppId(appId),
      this.triggersService.getAllByAppId(appId)
    ).subscribe(
      result => {
        this.credentialsKeys = result[0];
        this.triggers = result[1];
        this.showBusy = false;
        if ( result === undefined || result[0].length === 0) {
          this.appsService.getAppKeyCaptionsById(appId).subscribe(sresult => {
              console.log(`Loading app by appId ${appId} completed.`);
              this.appKeyCaption = sresult;
            }, error => console.log('Error: ' + error));
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
      () => console.log('LOAD_TRIGGERS_SUCCESS AND LOAD_KEYS_SUCCESS.')
      );
  }

}
