import { Component, OnInit } from '@angular/core';

import {AuthService} from "../../../services/auth.service";
import {BuildingService} from "../../../services/building.service";

import {Building} from "../../../models/Building";

import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, first} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorHandlerService} from "../../../services/error-handler.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.css']
})
export class BuildingsComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  userId : number;
  buildings$: Building[];

  closeResult : string;

  addBuildingForm: FormGroup;

  updateBuildingForm: FormGroup;
  buildingFormId: number;
  buildingFormName: string;
  buildingFormCity: string;
  buildingFormAddress: string;
  buildingFormNumber: number;


  constructor(private authService: AuthService, private buildingService: BuildingService,
              private modalService : NgbModal, private errorHandlerService: ErrorHandlerService,
              private router:Router) { }


  ngOnInit(): void {
    this.isAdmin = Boolean(localStorage.getItem("isAdmin"));
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));

    this.userId = Number(sessionStorage.getItem("userId"));
    // @ts-ignore
    this.buildingService.findBuilding(this.userId).subscribe((buildings: Building[]) => {
      this.buildings$ = buildings;
    });
    this.addBuildingForm = this.createFormGroup();
    this.updateBuildingForm = this.createFormGroup();
  }

  onDeleteBuildingClick(id: number, owner : number) {
    this.buildingService.deleteBuilding(id, owner).subscribe((res: any) => {
      this.buildings$ = this.buildings$.filter(val => val.id !== id);
      console.log(res);
    })
  }

  openUpdate(content : any, buildingId : number, buildingName : string, buildingCity : string,
             buildingAddress : string, buildingNumber : number) {
    this.buildingFormId = buildingId;
    this.buildingFormName = buildingName;
    this.buildingFormCity = buildingCity;
    this.buildingFormAddress = buildingAddress;
    this.buildingFormNumber = buildingNumber;
    this.loadValues();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  loadValues() {
    this.updateBuildingForm.patchValue({
        name : this.buildingFormName,
        city : this.buildingFormCity,
        address : this.buildingFormAddress,
        street_number : this.buildingFormNumber
      }
    );
  }


  open(content : any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(7)]),
      city: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required, Validators.minLength(7)]),
      street_number: new FormControl("", [Validators.required])
    });
  }

  addBuilding (userId: number) {
    this.buildingService.addBuilding(userId, this.addBuildingForm.value)
      .pipe(
      first(),
      catchError(this.errorHandlerService.handleError<Building>("building")))
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
      window.location.reload();
  }


  updateBuilding () {
    this.buildingService.updateBuilding(this.buildingFormId, this.userId, this.updateBuildingForm.value)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Building>("building")))
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
    window.location.reload();
  }

  findShutter(buildingId: number) {
    sessionStorage.setItem("buildingId", buildingId.toString());
    this.router.navigate(["shutters"]);
  }

}
