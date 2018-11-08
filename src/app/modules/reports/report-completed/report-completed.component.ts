import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from '../../employee/employee.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-completed',
  templateUrl: './report-completed.component.html',
  providers: [EmployeeModel]
})
export class ReportCompletedComponent implements OnInit {

  constructor(
    private employeeModel: EmployeeModel,
    private router:Router,
    private route: ActivatedRoute
    ) {
    
  }

  ngOnInit(): void {
    this.employeeModel.SelectedId$.subscribe((selectedId) => {
       
      if(selectedId)
      this.router.navigate([selectedId], { relativeTo: this.route})
    })
  }

}
