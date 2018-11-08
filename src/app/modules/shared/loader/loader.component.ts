import { Component, Input } from "@angular/core";

@Component({
    selector:"app-loader",
    template:`   
     
    <div class="preloader" *ngIf="IsLoad"></div>
    
    <ng-content *ngIf="!IsLoad"></ng-content>
    `,
    // moduleId:module.id,
    styleUrls:["loader.component.css"]
})
export class LoaderComponent{

    @Input("IsLoad")
    IsLoad:boolean=false;
}