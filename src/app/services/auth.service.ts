import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { User } from "../models/User";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, first} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userUsername: Pick<User, "id">;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions);
  }

}
