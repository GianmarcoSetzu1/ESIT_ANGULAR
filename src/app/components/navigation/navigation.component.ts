import { Component, OnInit } from '@angular/core';

import { AuthService } from "src/app/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
       this.isAuthenticated = isLoggedIn;
    });
    if (Boolean(localStorage.getItem("isUserLoggedIn")))
      this.isAuthenticated = true;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("isAdmin");
    sessionStorage.removeItem("userId");
    this.isAuthenticated = false;
    this.router.navigate(["login"]);
  }

}
