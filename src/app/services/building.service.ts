import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Router } from "@angular/router";

import {Building} from "../models/Building";
import {Shutter} from "../models/Shutter";

import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private url = "http://3.69.95.103:8000/buildings";
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {}

  findBuilding(id: number) {
    return this.http.get(`${this.url}/buildings/${id}`);
  }

  deleteBuilding(id: number, owner: number) {
    return this.http.get(`${this.url}/buildings/${id}/${owner}`);
  }

  addBuilding(userId : number, building : Omit<Building, "id, owner"> ): Observable<any>{
    return this.http.post(`${this.url}/buildings/${userId}`,building, this.httpOptions);
  }

  updateBuilding(buildingId : number, userId : number, building : Omit<Building, "id, owner"> ): Observable<any>{
    return this.http.post(`${this.url}/buildings/${buildingId}/${userId}`, building, this.httpOptions);
  }

  findShutter(buildingId: number) {
    return this.http.get(`${this.url}/shutterss/${buildingId}`);
  }

  deleteShutter(id: number, building: number) {
    return this.http.get(`${this.url}/shutters/${id}/${building}`);
  }

  addShutter(buildingId : number, shutter : Omit<Shutter, "id, building"> ): Observable<any>{
    return this.http.post(`${this.url}/shutters/${buildingId}`, shutter, this.httpOptions);
  }

  updateShutter(shutterId : number, buildingId : number, shutter : Omit<Shutter, "id, building"> ): Observable<any>{
    return this.http.post(`${this.url}/shutters/${shutterId}/${buildingId}`, shutter, this.httpOptions);
  }


  updateSlot(shutterId: number, slot : string, value: number) {
    return this.http.get(`${this.url}/shutters/${shutterId}/${slot}/${value}`);
  }

  updateClosure(shutterId: number, value: number) {
    return this.http.post(`${this.url}/shutters/`,
      {'shutterId' : shutterId, 'value' : value});
  }

  getStatus(buildingId: number) {
    return this.http.get(`${this.url}/shutters/${buildingId}`);
  }

}
