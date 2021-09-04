import { Component, OnInit } from '@angular/core';
import {Shutter} from "../../../models/Shutter";
import {BuildingService} from "../../../services/building.service";

@Component({
  selector: 'app-shutters-user',
  templateUrl: './shutters-user.component.html',
  styleUrls: ['./shutters-user.component.css']
})
export class ShuttersUserComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  buildingId : number;
  shutters$ : Shutter[];

  constructor(private buildingService: BuildingService) { }

  ngOnInit(): void {
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));
    this.buildingId = Number(sessionStorage.getItem("buildingId"));
    // @ts-ignore
    this.buildingService.findShutter(this.buildingId).subscribe((shutters: Shutter[]) => {
      this.shutters$ = shutters;
    });
  }

}
