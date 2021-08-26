import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "src/app/services/auth.service";
import {User} from "../../models/User";
import {catchError, first, tap} from "rxjs/operators";
import {ErrorHandlerService} from "../../services/error-handler.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

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

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService, private router:Router) {}

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
        tap((tokenObject: { token: string; userId: Pick<User, "id">; userName: Pick<User, "name"> }) => {
          this.userId = tokenObject.userId;
          this.userName = tokenObject.userName;     //Retrieved from tokenObject (backend)

          this.authService.userId = this.userId;    //Added manually to pass this parameters to other components
          this.authService.userName = this.userName;
          localStorage.setItem("token", tokenObject.token);   //Setted only in login component
          this.isUserLoggedIn$.next(true);
          // @ts-ignore
          if (this.authService.userId === 0)
              this.router.navigate(["adminhome"]);
          else
              this.router.navigate(["home"]);
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

  //   .login(this.loginForm.value.email, this.loginForm.value.password)
    //   .subscribe();

}
