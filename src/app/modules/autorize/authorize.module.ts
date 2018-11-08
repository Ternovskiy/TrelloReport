import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./authorize.component";
import { EmployeeModule } from "../employee/employee.module";

const routes:Route[]=[
    { path:"auth", component:AuthComponent}
];

@NgModule({
imports:[
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    EmployeeModule
],
declarations:[AuthComponent],
providers:[],
exports:[RouterModule,AuthComponent]
})
export class AutorizeModule {
}