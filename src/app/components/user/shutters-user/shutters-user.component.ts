import { Component, OnInit } from '@angular/core';
import {Shutter} from "../../../models/Shutter";
import {BuildingService} from "../../../services/building.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, first} from "rxjs/operators";
import {User} from "../../../models/User";
import {ErrorHandlerService} from "../../../services/error-handler.service";

@Component({
  selector: 'app-shutters-user',
  templateUrl: './shutters-user.component.html',
  styleUrls: ['./shutters-user.component.css']
})
export class ShuttersUserComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  buildingId : number;
  selectedOption : number;
  shutters$ : Shutter[];
  value$ : any;

  //shutterTimeValue : FormGroup;

  constructor(private buildingService: BuildingService, private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));
    this.buildingId = Number(sessionStorage.getItem("buildingId"));
    // @ts-ignore
    this.buildingService.findShutter(this.buildingId).subscribe((shutters: Shutter[]) => {
      this.shutters$ = shutters;
    });
    this.selectedOption = -1;
    this.value$ = -1;//this.recupero(1, 1);
    //this.shutterTimeValue = this.createFormGroup();
  }

  updateSlot(shutterId: number, val: any, slot: string) {
    this.buildingService.updateSlot(shutterId, slot, Number(val.target.value))
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("update")))
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
    console.log("Tapparella : ", shutterId);
    console.log("Selected : ", val.target.value);
  }

}
