import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { App } from "app/core/apps/app";
import { AppKeyCaption } from "app/core/apps/appKeyCaption";
import { CredentialKey } from "app/core/apps/credential.key";

@Injectable()
export class AppsService {
  constructor(private http: Http) { }

  public async getPublishedAsync(): Promise<App[]> {
    const response = await this.http.get(`v1/apps/published`).toPromise();
    return response.json() as App[];
  }

  public getPublished(): Observable<App[]> {
    return this.http
      .get(`v1/apps/published`)
      .map(
      response => {
        let result = response.json() as App[];
        return result;
      });
  }

  public getAppKeyCaptionsById(appId: string): Observable<AppKeyCaption> {
    return this.http
      .get(`v1/apps/${appId}`)
      .map(
      response => {
        let result = response.json() as AppKeyCaption;
        return result;
      });
  }

  public getKeysByAppId(appId: string): Observable<CredentialKey[]> {
    return this.http
      .get(`v1/keys?appId=${appId}`)
      .map(
      response => {
        let result = response.json() as CredentialKey[];
        return result;
      });
  }

  public createAppKeyCaption(appId: string, appKeyCaption: AppKeyCaption): Observable<Response> {
    return this.http
      .post(`v1/keys`,
      {
        "AppId": appId,
        "AppKeys": appKeyCaption['AppKeys']
      });
  }
}
