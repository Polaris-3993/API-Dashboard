import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { IntegrationDetailsService } from "app/core/integration-details/integration-details.service";
import { Subscription } from "rxjs/Subscription";
import { AppsService } from "app/core/apps/apps.service";
import { App } from "app/core/apps/app";
import { ActionsService } from "app/core/actions/actions.service";
import { Action } from "app/core/actions/action";
import { ConnectorsService } from "app/core/connectors/connectors.service";
import { IntegrationRequest } from "app/core/connectors/integration.request";
import { Trigger } from "app/core/triggers/trigger";
import { ActionSetup } from "app/routes/integration-details/action-setup/action.setup";
import { TriggerSetup } from "app/routes/integration-details/trigger-setup/trigger.setup";
import { TriggerSetupComponent } from "app/routes/integration-details/trigger-setup/trigger-setup.component";
import { ActionSetupComponent } from "app/routes/integration-details/action-setup/action-setup.component";
import { EditorConfiguration } from "codemirror";
import { TriggersService } from "app/core/triggers/triggers.service";
import { ActivatedRoute, Params } from "@angular/router";


const swal = require('sweetalert');

@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.scss'],
  providers: [AppsService, ActionsService, ConnectorsService, TriggersService]
})
export class IntegrationDetailsComponent implements OnInit, OnDestroy {
  public integrationRequest: IntegrationRequest;
  public config: any;
  public tokens: string[];
  public title: string;
  public isSaving: boolean;
  public selectedTabIndex: number;

  private subscriptions: Subscription[] = [];
  private triggerSetup: TriggerSetup;
  private bsModalRef: BsModalRef;
  private apps: App[];
  private integrationId: string;

  constructor(private modalService: BsModalService,
    private integrationDetailsService: IntegrationDetailsService,
    private appsService: AppsService,
    private actionsService: ActionsService,
    private connectorsService: ConnectorsService,
    private triggerService: TriggersService,
    private activatedRoute: ActivatedRoute) {
    this.integrationRequest = new IntegrationRequest();

    this.configurationCodeEditor();
  }

  async ngOnInit() {
    this.initializeSubscriptions();

    this.modalServiceConfiguration();

    console.log('LOAD_APPS_START.')
    this.apps = await this.appsService.getPublishedAsync();
    console.log('LOAD_APPS_SUCCESS.')

    this.integrationId = await this.getIntegrationIdAsync();
    if (!this.integrationId)
      this.runTriggerSetupWorlkflow();
    else {
      console.log(`Navigated to ${this.integrationId} edit integration.`);

      this.integrationRequest = await this.connectorsService.getByIdAsync(this.integrationId, this.apps);

      console.log('LOAD_TOKENS_START');
      this.tokens = await this.triggerService.getTokensByTriggerIdAsync(this.integrationRequest.TriggerSetup.Trigger.Id)
      console.log('LOAD_TOKENS_SUCCESS.')

      this.runEditTriggerSetupWorlkflow();
    }
  }

  public async saveIntegration() {
    if (this.integrationRequest.anyActionSetupCodeBlockIsEmpty()) {
      swal({
        title: 'Missing required field',
        text: 'Code in actions is required field!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'OK',
        closeOnConfirm: true
      });
    } else {
      this.isSaving = true;

      console.log('SAVE_INTEGRATION_START.')
      let response;
      if (this.integrationId)
        response = await this.connectorsService.update(this.integrationId, this.integrationRequest);
      else
        response = await this.connectorsService.create(this.integrationRequest);
      console.log('SAVE_INTEGRATION_SUCCESS.')

      if (response.ok) swal('Good job!', 'You created a new integration!', 'success');

      this.isSaving = false;
    }
  }

  public doOnTabSelect(currentTab: ActionSetup, index) {
    currentTab.Active = true;
    this.selectedTabIndex = index;
  };

  public addIntegrationTab(): void {
    let actions = this.integrationRequest.getActiveActionSetup();
    if (actions) {
      actions.forEach(action => {
        action.Active = false;
      });
    }

    this.createNewActionSetup();
    this.openActionSetup();
  }

  public runTriggerSetupWorlkflow() {
    this.title = 'New Integration'
    this.openTriggerSetup();
    this.createNewTriggerSetup();
  }

  public runEditTriggerSetupWorlkflow() {
    this.title = 'Edit Integration'
  }

  public openTriggerSetup() {
    this.bsModalRef = this.modalService.show(TriggerSetupComponent);
    this.bsModalRef.content.title = 'Trigger Setup';
    this.bsModalRef.content.apps = this.apps;
  }

  public editTriggerSetup(triggerSetup: TriggerSetup) {
    this.openTriggerSetup();

    if (triggerSetup.App && triggerSetup.Trigger) {
      this.bsModalRef.content.appId = triggerSetup.App.Id;
      this.bsModalRef.content.currentTriggerSetup = triggerSetup;
      this.bsModalRef.content.selectedAppName = triggerSetup.App.Name;
      this.bsModalRef.content.selectedTriggerName = triggerSetup.Trigger.Title;
      this.bsModalRef.content.appKeyCaption = triggerSetup.AppKeyCaption;
      this.bsModalRef.content.selectedCredentialKey = triggerSetup.CredentialsKey;
    }
  }

  public editActionSetup(actionSetup: ActionSetup) {
    this.openActionSetup();

    if (actionSetup.App && actionSetup.Action) {
      this.bsModalRef.content.appId = actionSetup.App.Id;
      this.bsModalRef.content.currentActionSetup = actionSetup;
      this.bsModalRef.content.selectedAppName = actionSetup.App.Name;
      this.bsModalRef.content.selectedActionName = actionSetup.Action.Title;
      this.bsModalRef.content.appKeyCaption = actionSetup.AppKeyCaption;
      this.bsModalRef.content.selectedCredentialKey = actionSetup.CredentialsKey;
    }
  }

  public removeActionSetup(actionSetup: ActionSetup) {
    this.integrationRequest.removeActionSetup(actionSetup);
  }

  public replaceText(token: string) {
    //Todo: replace element zero with selected tab index
    this.integrationRequest.ActionsSetup[this.selectedTabIndex].CodeBlock = this.integrationRequest.ActionsSetup[this.selectedTabIndex].CodeBlock.replace("\"REPLACE EVENT TOKEN\"", token);
  }

  private modalServiceConfiguration() {
    this.modalService.config.keyboard = false;
    this.modalService.config.class = 'modal-md';
  }

  private openActionSetup() {
    this.bsModalRef = this.modalService.show(ActionSetupComponent);
    this.bsModalRef.content.title = 'Action Setup';
    this.bsModalRef.content.apps = this.apps;
  }

  private createNewTriggerSetup() {
    this.integrationRequest.TriggerSetup = new TriggerSetup();
    this.integrationRequest.TriggerSetup.Trigger = new Trigger();

    this.createNewActionSetup();
  }

  private createNewActionSetup() {
    var actionSetup = new ActionSetup();
    actionSetup.Action = new Action();

    this.integrationRequest.ActionsSetup.push(actionSetup);
  }

  private configurationCodeEditor() {
    this.config = { lineNumbers: true, mode: 'javascript', theme: 'ambiance', autoRefresh: true };
  }

  private async getIntegrationIdAsync(): Promise<string> {
    const params = await this.activatedRoute.paramMap.first().toPromise();
    const integrationId = params.get('id');
    return integrationId
  }

  private initializeSubscriptions() {
    this.subscriptions.push(this.modalService.onShow.subscribe((reason: string) => {
      console.log(`onShow event has been fired`)
    }));

    this.subscriptions.push(this.modalService.onHide.subscribe((reason: string) => {
      console.log(`onHide event has been fired ${reason ? ', dismissed by ' + reason : ''}`);
    }));

    this.subscriptions.push(this.integrationDetailsService.appSelected$.subscribe(
      app => {
        console.log(`App selected.`)
      }));

    this.subscriptions.push(this.integrationDetailsService.triggerSelected$.subscribe(
      trigger => {
      }));

    this.subscriptions.push(this.integrationDetailsService.actionSelected$.subscribe(
      action => {
      }));

    this.subscriptions.push(this.integrationDetailsService.triggerCreated$.subscribe(
      async triggerSetup => {
        this.triggerSetup = triggerSetup;

        console.log('LOAD_TOKENS_START');
        this.tokens = await this.triggerService.getTokensByTriggerIdAsync(this.triggerSetup.Trigger.Id)
        console.log('LOAD_TOKENS_SUCCESS.')

        this.bsModalRef.hide();

        if (this.integrationRequest.TriggerSetup.isEmptyTrigger()) {
          console.log('Open ActionSetup window.');
          this.openActionSetup();
        } else
          console.log('TriggerSetup updated.');

        this.integrationRequest.TriggerSetup = this.triggerSetup;
      }));

    this.subscriptions.push(this.integrationDetailsService.actionCreated$.subscribe(
      actionSetup => {

        let indexOfActiveActionSetup = this.integrationRequest.ActionsSetup.findIndex(x => x.Active);
        this.integrationRequest.ActionsSetup[indexOfActiveActionSetup] = actionSetup;

        this.bsModalRef.hide();
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
    if (this.bsModalRef) this.bsModalRef.hide();
  }

}
