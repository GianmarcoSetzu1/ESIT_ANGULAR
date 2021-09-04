import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {catchError, first} from "rxjs/operators";
import {User} from "../../../models/User";
import {ErrorHandlerService} from "../../../services/error-handler.service";



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isAuthenticated = false;
  isAdmin = false;

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService, private router:Router) {}

  ngOnInit(): void {
    this.isAdmin = Boolean(localStorage.getItem("isAdmin"));
    this.isAuthenticated = Boolean(localStorage.getItem("isUserLoggedIn"));
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      )
      .subscribe(
        resp => console.log(resp),
        err => console.log(err)
      );
      this.router.navigate(["adminhome"]);
      //this.router.navigate(["login"]);
      console.log(this.signupForm.value);
  }
}
