import { Component, OnInit } from '@angular/core';


import { AuthService } from "src/app/services/auth.service";

import { User } from "src/app/models/User"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId : Pick<User, "id">;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.userId;
  }

}
