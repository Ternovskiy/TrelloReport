import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from './employee.model';
import { IMember } from '../shared/Interfaces/IMember';


@Component({
  selector: 'app-emploee',
  templateUrl: './emploee.component.html',
  styleUrls: ['./emploee.component.css'],
  providers: []
})

export class EmploeeComponent implements OnInit {
  Items:IMember[] = [];
  constructor(private employeeModel: EmployeeModel) { }

  ngOnInit() {
    this.IsLoad=true;
    this.employeeModel.GetMembers().then((data) => {
      this.Items = data;
      this.IsLoad=false;
    });
  }

  IsLoad:boolean=false;
  setSelected(id) {
    this.employeeModel.SelectedId = id;
  }
  isSelected(id) {
    return this.employeeModel.SelectedId === id;
  }

}
