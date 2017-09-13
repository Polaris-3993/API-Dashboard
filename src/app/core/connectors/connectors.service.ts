import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { Connector } from "app/core/connectors/connector";
import { IntegrationRequest } from "app/core/connectors/integration.request";
import { TriggerSetup } from "app/routes/integration-details/trigger-setup/trigger.setup";
import { Trigger } from "app/core/triggers/trigger";
import { Action } from "app/core/actions/action";
import { ActionSetup } from "app/routes/integration-details/action-setup/action.setup";
import { TriggersService } from "app/core/triggers/triggers.service";
import { App } from "app/core/apps/app";
import { ActionsService } from "app/core/actions/actions.service";
import { ActionResource } from "app/core/actions/action.resource";
import { TriggerConnector } from "app/core/connectors/trigger.connector";
import { CredentialKey } from "app/core/apps/credential.key";

@Injectable()
export class ConnectorsService {
  constructor(private http: Http, private triggerService: TriggersService, private actionsService: ActionsService) { }

  public getAll(): Observable<Connector[]> {
    return this.http
      .get(`v1/integrations`)
      .map(
      response => {
        const BODY = response.json();

        let result: Connector[] = [];

        BODY.forEach(el => {
          result.push(new Connector(el));
        });

        return result;
      });
  }

  public delete(id: string) {
    return this.http
      .delete(`v1/integrations/${id}`);
  }

  public run(id: string) {
    return this.http
      .post(`v1/integrations/${id}/run`, {});
  }

  public create(integrationRequest: IntegrationRequest): Promise<Response> {
    const triggerSetup = integrationRequest.TriggerSetup;
    return this.http
      .post(`v1/integrations`,
      {
        "TriggerId": triggerSetup.Trigger.Id,
        "AppKeysId": triggerSetup.AppKeyCaption != null ? triggerSetup.AppKeyCaption.Id : triggerSetup.CredentialsKey.Id,
        "Actions": integrationRequest.ActionsSetup.map(x => {
          return {
            "Id": x.Action.Id,
            "Script": x.CodeBlock,
            "ActionKeysId": x.AppKeyCaption != null ? x.AppKeyCaption.Id : x.CredentialsKey.Id
          };
        })
      })
      .toPromise();
  }

  public update(integrationId: string, integrationRequest: IntegrationRequest): Promise<Response> {
    const triggerSetup = integrationRequest.TriggerSetup;
    return this.http
      .put(`v1/integrations/${integrationId}`,
      {
        "TriggerId": triggerSetup.Trigger.Id,
        "AppKeysId": triggerSetup.AppKeyCaption != null ? triggerSetup.AppKeyCaption.Id : triggerSetup.CredentialsKey.Id,
        "Actions": integrationRequest.ActionsSetup
          .filter(a => !a.isEmptyAction())
          .map(x => {
            return {
              "Id": x.Action.Id,
              "Script": x.CodeBlock,
              "ActionKeysId": x.AppKeyCaption != null ? x.AppKeyCaption.Id : x.CredentialsKey.Id
            };
          })
      })
      .toPromise();
  }

  public async getByIdAsync(id: string, apps: App[]): Promise<IntegrationRequest> {
    const response = await this.http.get(`v1/integrations/${id}`).toPromise();
    const integrationResponse = response.json() as any;

    let triggerSetup = new TriggerSetup();
    triggerSetup.Trigger = new Trigger();
    triggerSetup.Trigger.Id = integrationResponse.Trigger.Id;
    triggerSetup.Trigger.Title = integrationResponse.Trigger.Name;
    triggerSetup.App = new App();

    const triggerResource = await this.triggerService.getByIdAsync(integrationResponse.Trigger.Id);
    triggerSetup.App.Id = triggerResource.AppId;
    triggerSetup.App.Name = new TriggerConnector(integrationResponse).Name;
    triggerSetup.CredentialsKey = new CredentialKey();
    triggerSetup.CredentialsKey.Id = integrationResponse.Trigger.KeysId;

    let actionTasks = [];
    integrationResponse.Actions.forEach(element => {
      actionTasks.push(this.actionsService.getById(element.Id));
    });

    let actionsSetup = [];
    const length = integrationResponse.Actions.length;
    Observable.forkJoin(actionTasks).subscribe(results => {
      results.forEach((element, index) => {
        const result = results[index] as ActionResource;
        let actionSetup = new ActionSetup(index === length - 1 ? true : false);

        actionSetup.App = new App();
        const actionApp = apps.find(a => a.Id == result.AppId);
        actionSetup.App.Id = actionApp.Id;
        actionSetup.App.Name = actionApp.Name;

        const action = integrationResponse.Actions.find(x => x.Id == result.Id);
        actionSetup.CredentialsKey = new CredentialKey();
        actionSetup.CredentialsKey.Id = action.KeysId;
        actionSetup.Action = new Action();
        actionSetup.Action.Id = result.Id;
        actionSetup.Action.Title = result.Title;
        actionSetup.CodeBlock = action.Script;
        actionsSetup.push(actionSetup);
      });
    });

    const integrationRequest = new IntegrationRequest(triggerSetup, actionsSetup);
    return integrationRequest;
  }

}
