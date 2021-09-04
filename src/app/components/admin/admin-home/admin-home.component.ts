import { Component, OnInit } from '@angular/core';

import {AuthService} from "../../../services/auth.service";
import {BuildingService} from "../../../services/building.service";


import {ErrorHandlerService} from "../../../services/error-handler.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../../../models/User";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, first} from "rxjs/operators";
import {Building} from "../../../models/Building";

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

  closeResult : string;

  updateUserForm: FormGroup;
  userFormId: number;
  userFormName: string;
  userFormEmail: string;

  constructor(private authService: AuthService, private buildingService: BuildingService,
              private modalService : NgbModal, private router:Router,
              private errorHandlerService: ErrorHandlerService) {}


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
    });

    this.updateUserForm = this.createFormGroup();


    //this.updateUserForm.controls.name.setValue(this.userFormName);
    //this.updateUserForm.controls.email.setValue(this.userFormEmail);

  }

  loadValues() {
    this.updateUserForm.patchValue({
        name : this.userFormName,
        email : this.userFormEmail
      }
    );
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

  open(content : any, userId : number, userName: string, userEmail : string) {
    this.userFormId = userId;
    this.userFormName = userName;
    this.userFormEmail = userEmail;
    this.loadValues();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)} userName : ` + this.updateUserForm.value.name;
    });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(3)], ),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("")
    });
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

  updateUser() {
    this.authService.updateUser(this.userFormId, this.updateUserForm.value)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("update")))
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
    window.location.reload();
  }
}
