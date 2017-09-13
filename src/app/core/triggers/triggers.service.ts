import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Trigger } from "app/core/triggers/trigger";
import { Observable } from "rxjs/Observable";
import { TriggerResource } from "app/core/triggers/trigger.resource";

@Injectable()
export class TriggersService {
  constructor(private http: Http) { }

  public getAllByAppId(appId: string): Observable<Trigger[]> {
    return this.http
      .get(`v1/triggers?appId=${appId}`)
      .map(
      response => {
        let result = response.json() as Trigger[];
        return result;
      });
  }

  public async getTokensByTriggerIdAsync(triggerId: string): Promise<string[]> {
    const response = await this.getByIdAsync(triggerId);
    return response.EventTokens;
  }

  public async getByIdAsync(triggerId: string): Promise<TriggerResource> {
    const response = await this.http.get(`v1/triggers/${triggerId}`).toPromise();
    return response.json() as TriggerResource;
  }

}