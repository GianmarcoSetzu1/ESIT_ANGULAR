import { Component, OnInit } from '@angular/core';
import {Shutter} from "../../../models/Shutter";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BuildingService} from "../../../services/building.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorHandlerService} from "../../../services/error-handler.service";
import {Building} from "../../../models/Building";
import {catchError, first} from "rxjs/operators";

@Component({
  selector: 'app-shutters',
  templateUrl: './shutters.component.html',
  styleUrls: ['./shutters.component.css']
})

export class ShuttersComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  buildingId : number;
  shutters$ : Shutter[];

  closeResult : string;

  addShutterForm: FormGroup;

  updateShutterForm: FormGroup;
  shutterFormId: number;
  shutterFormName: string;
  shutterFormRoom: string;

  constructor(private buildingService: BuildingService,
              private modalService : NgbModal, private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
    this.isAdmin = Boolean(localStorage.getItem("isAdmin"));
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));

    this.buildingId = Number(sessionStorage.getItem("buildingId"));
    // @ts-ignore
    this.buildingService.findShutter(this.buildingId).subscribe((shutters: Shutter[]) => {
      this.shutters$ = shutters;
    });
    this.addShutterForm = this.createFormGroup();
    this.updateShutterForm = this.createFormGroup();
  }


  onDeleteShutterClick(id: number, building : number) {
    this.buildingService.deleteShutter(id, building).subscribe((res: any) => {
      this.shutters$ = this.shutters$.filter(val => val.id !== id);
      console.log(res);
    })
  }

  openUpdate(content : any, shutterId : number, shutterName : string, shutterRoom : string ){
    this.shutterFormId = shutterId;
    this.shutterFormName = shutterName;
    this.shutterFormRoom = shutterRoom;
    this.loadValues();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  loadValues() {
    this.updateShutterForm.patchValue({
          name : this.shutterFormName,
          room : this.shutterFormRoom
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
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      room: new FormControl("", [Validators.required, Validators.minLength(7)]),
    });
  }


  addShutter (buildingId: number) {
    this.buildingService.addShutter(buildingId, this.addShutterForm.value)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Shutter>("shutter")))
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
    window.location.reload();
  }

  updateShutter () {
    this.buildingService.updateShutter(this.shutterFormId, this.buildingId, this.updateShutterForm.value)
        .pipe(
            first(),
            catchError(this.errorHandlerService.handleError<Building>("building")))
        .subscribe(
            resp => console.log(resp),
            err => console.log(err)
        );
    window.location.reload();
  }
}
