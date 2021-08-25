import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { User } from "../models/User";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, first, tap} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id">;


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


  login(email: Pick<User, "email">, password: Pick<User, "password">): Observable<any> {
    //console.log(this.userId);
    return this.http
      .post(`${this.url}`, {email, password}, this.httpOptions);
      //.post(`${this.url}/login`, {email, password}, this.httpOptions);
  }

}
