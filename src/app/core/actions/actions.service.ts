import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Action } from "app/core/actions/action";
import { ActionResource } from "app/core/actions/action.resource";

@Injectable()
export class ActionsService {

  constructor(private http: Http) { }

  public getAllByAppId(appId: string): Observable<Action[]> {
    return this.http
      .get(`v1/actions?appId=${appId}`)
      .map(
      response => {
        let result = response.json() as Action[];
        return result;
      });
  }

  public getById(actionId: string): Observable<ActionResource> {
    return this.http
      .get(`v1/actions/${actionId}`)
      .map(
      response => {
        let result = response.json() as ActionResource;
        return result;
      });
  }

  public getTemplateById(actionId: string): Observable<any> {
    return this.http
      .get(`v1/actions/${actionId}/template`)
      .map(
        response => {
          let result = response.json() as any;
          return result;
        });
  }

}
