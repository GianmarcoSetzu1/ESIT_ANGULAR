import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
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

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService, private router:Router) {}


  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((isAdminIn) => {
      this.isAdmin = isAdminIn;
    });
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
    // @ts-ignore
    this.authService.getUsers().subscribe((users: User[]) => {
      this.users$ = users;
    })
  }

  onDeleteUserClick(id: number) {
    this.authService.deleteUser(id).subscribe((res: any) => {
      this.users$ = this.users$.filter(val => val.id !== id);
      console.log(res);
    })
  }
}
