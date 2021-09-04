import { Component, OnInit } from '@angular/core';


import { AuthService } from "src/app/services/auth.service";

import { User } from "src/app/models/User"
import {Building} from "../../../models/Building";
import {BuildingService} from "../../../services/building.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //userId : Pick<User, "id">;
  userId : number;
  //userName : Pick<User, "name">
  userName : string;

  isAuthenticated = false;
  isAdmin = false;

  buildings$: Building[];

  constructor(private authService: AuthService, private buildingService: BuildingService,
              private router:Router) {}

  ngOnInit(): void {
    //this.userId = this.authService.userId;
    //this.userName = this.authService.userName;

    this.userId = Number(sessionStorage.getItem("userId"));
    this.userName = String(sessionStorage.getItem("userName"));

    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));
    // @ts-ignore
    this.buildingService.findBuilding(this.userId).subscribe((buildings: Building[]) => {
      this.buildings$ = buildings;
    });
  }

  findShutter(buildingId: number) {
    sessionStorage.setItem("buildingId", buildingId.toString());
    this.router.navigate(["shuttersuser"]);
  }

}
