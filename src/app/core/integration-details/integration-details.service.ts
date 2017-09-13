import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { TriggerSetup } from "app/routes/integration-details/trigger-setup/trigger.setup";
import { Action } from "app/core/actions/action";
import { App } from "app/core/apps/app";
import { Trigger } from "app/core/triggers/trigger";
import { ActionSetup } from "app/routes/integration-details/action-setup/action.setup";

@Injectable()
export class IntegrationDetailsService {

  private appSelectedSource = new Subject<App>();
  private triggerSelectedSource = new Subject<Trigger>();
  private actionSelectedSource = new Subject<Action>();

  private triggerCreatedSource = new Subject<TriggerSetup>();
  private actionCreatedSource = new Subject<ActionSetup>();

  appSelected$ = this.appSelectedSource.asObservable();
  triggerSelected$ = this.triggerSelectedSource.asObservable();
  actionSelected$ = this.actionSelectedSource.asObservable();

  triggerCreated$ = this.triggerCreatedSource.asObservable();
  actionCreated$ = this.actionCreatedSource.asObservable();

  constructor() { }

  appSelected(app: App) {
    this.appSelectedSource.next(app);
  }

  triggerSelected(app: Trigger) {
    this.triggerSelectedSource.next(app);
  }

  actionSelected(app: Action) {
    this.actionSelectedSource.next(app);
  }

  saveTrigger(trigger: TriggerSetup) {
    this.triggerCreatedSource.next(trigger);
  }

  saveAction(action: ActionSetup) {
    this.actionCreatedSource.next(action);
  }
}
