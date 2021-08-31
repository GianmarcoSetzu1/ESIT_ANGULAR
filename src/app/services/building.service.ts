import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Router } from "@angular/router";

import {Building} from "../models/Building";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private url = "http://localhost:8000/buildings";
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

}
