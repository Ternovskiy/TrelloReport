import { NgModule } from "@angular/core";
import { EmploeeComponent } from "./emploee.component";
import { EmployeeModel } from "./employee.model";
import { SharedModule } from "../shared/shared.module";
import { CommonModule } from "../../../../node_modules/@angular/common";

@NgModule({
    imports:[CommonModule, SharedModule],
    declarations:[EmploeeComponent],
    providers:[EmployeeModel],
    exports:[EmploeeComponent]
})
export class EmployeeModule{}