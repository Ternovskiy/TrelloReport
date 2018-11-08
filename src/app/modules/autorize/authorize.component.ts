import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeeModel } from "../employee/employee.model";
import { UserService } from "../shared/services/user.service";

@Component({
    templateUrl:"authorize.component.html",
    providers:[EmployeeModel]
})
export class AuthComponent implements OnInit {
    constructor(
        private userService:UserService, 
        private empModel:EmployeeModel,
        private router:Router
    ) {
        
    }

    ngOnInit(){
        this.empModel.SelectedId$.subscribe(userId=>{
            if(userId){this.userService.CurentUserId=userId;
            this.router.navigate(["/"])
            }
        })
    }
}