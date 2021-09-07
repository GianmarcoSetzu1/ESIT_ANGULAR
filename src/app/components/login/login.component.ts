import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "src/app/services/auth.service";
import { BuildingService} from "../../services/building.service";

import {User} from "../../models/User";
import {catchError, first, tap} from "rxjs/operators";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id">;
  userName: Pick<User, "name">;
  //users$ : Observable<User[]>


  constructor(private authService: AuthService, private buildingService: BuildingService,  private errorHandlerService: ErrorHandlerService, private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        first(),
        tap((tokenObject: { token: string; userId: Pick<User, "id">; userName: Pick<User, "name">}) => {
          this.userId = tokenObject.userId;
          this.userName = tokenObject.userName;     //Retrieved from tokenObject (backend)

          this.authService.userId = this.userId;    //Added manually to pass this parameters to other components
          this.authService.userName = this.userName;

          localStorage.setItem("token", tokenObject.token);   //Set TOKEN
          localStorage.setItem("isUserLoggedIn", String(true));


          this.isUserLoggedIn$.next(true);
          this.authService.isUserLoggedIn$.next(true);   //Setted also in localStorage

          // @ts-ignore
          if (this.authService.userId === 0) {
            // @ts-ignore
            // this.authService.isAdmin$.next(true);   //Setted in localStorage
            // this.buildingService.isAdmin$.next(true);
            localStorage.setItem("isAdmin", String(true));
            this.router.navigate(["adminhome"]);
          }
          else {
            sessionStorage.setItem("userName", String(this.userName));
            sessionStorage.setItem("userId", String(this.userId));
            this.router.navigate(["home"]);
          }
        }),
        catchError(this.errorHandlerService.handleError<{
            token: string;
            userId: Pick<User, "id">;
            userName: Pick<User, "name">;
          }>("login")
        )
      )
      .subscribe(
         resp => console.log(resp),
         err => console.log(err)
      );
  }
}
