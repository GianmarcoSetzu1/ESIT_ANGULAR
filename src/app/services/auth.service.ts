import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { User } from "../models/User";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, first, tap} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";
import {Building} from "../models/Building";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://3.122.206.142:8000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id">;
  userName : Pick<User, "name">;
  //users$ : Observable<User[]>;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions);
  }


  login(email: Pick<User, "email">, password: Pick<User, "password">): Observable<any> {
    return this.http
      .post(`${this.url}`, {email, password}, this.httpOptions);
  }

  //When admin is logged in, return list of users
  getUsers() {
    return this.http.get(`${this.url}/adminhome`);
  }

  deleteUser(id: number) {
    return this.http.get(`${this.url}/adminhome/${id}`);
  }

  updateUser(id: number, user : Omit<User, "id">): Observable<any> {
    return this.http.post(`${this.url}/adminhome/${id}`, user, this.httpOptions);
  }


}
