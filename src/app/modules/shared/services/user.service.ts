import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    constructor() {
        
    }

    get IsAuthorize():boolean{
        return !!localStorage["userId"];
    }

    get CurentUserId():string{
        return localStorage["userId"];
    }

    set CurentUserId(id:string){
        localStorage["userId"]=id;
    }
}