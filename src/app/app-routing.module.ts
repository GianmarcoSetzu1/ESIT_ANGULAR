import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from "./components/user/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/admin/signup/signup.component"
import { AdminHomeComponent } from "./components/admin/admin-home/admin-home.component";
import {BuildingsComponent} from "./components/admin/buildings/buildings.component";
import {ShuttersComponent} from "./components/admin/shutters/shutters.component";
import {ShuttersUserComponent} from "./components/user/shutters-user/shutters-user.component";

const routes: Routes = [
  { path: "shuttersuser", component: ShuttersUserComponent},
  { path: "shutters", component: ShuttersComponent},
  { path: "buildings", component: BuildingsComponent},
  { path: "home", component: HomeComponent },
  { path: "adminhome", component: AdminHomeComponent},
  { path: "", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "**", redirectTo: "" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
