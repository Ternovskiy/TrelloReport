import { Pipe } from "@angular/core";

@Pipe({
    name:"time"
})
export class AddTimePipe {
    transform(value: any){
        if(value){
            return value+'ч'
        }else{
            return '-';
        }
    }
}