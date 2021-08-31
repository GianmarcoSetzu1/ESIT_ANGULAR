import { Component, OnInit } from '@angular/core';

import {AuthService} from "../../services/auth.service";
import {BuildingService} from "../../services/building.service";


import {ErrorHandlerService} from "../../services/error-handler.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../../models/User";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  //users$: Observable<User[]>;
  isAuthenticated = false;
  isAdmin = false;
  users$: User[];

  constructor(private authService: AuthService, private buildingService: BuildingService, private router:Router) {}


  ngOnInit(): void {
    this.isAdmin = Boolean(localStorage.getItem("isAdmin"));
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));

    // this.authService.isAdmin$.subscribe((isAdminIn) => {
    //   this.isAdmin = isAdminIn;
    // });
    // this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
    //   this.isAuthenticated = isLoggedIn;
    // });
    // @ts-ignore

    this.authService.getUsers().subscribe((users: User[]) => {
      this.users$ = users;
    })
  }

  findBuilding(id: number) {
    sessionStorage.setItem("userId", id.toString());
    this.router.navigate(["buildings"]);
  }

  onDeleteUserClick(id: number) {
    this.authService.deleteUser(id).subscribe((res: any) => {
      this.users$ = this.users$.filter(val => val.id !== id);
      console.log(res);
    })
  }
}
