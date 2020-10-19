import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrailsService {

  private REST_API_SERVER = 'http://localhost:3000/trails';

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest() {
    return this.httpClient.get(this.REST_API_SERVER);
  }
}
