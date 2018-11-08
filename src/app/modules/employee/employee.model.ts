import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { TrelloService } from "../shared/services/trello.service";
import { IMember } from "../shared/Interfaces/IMember";


@Injectable()
export class EmployeeModel {

    constructor(private trelloService: TrelloService) {

    }

    _selectedId;
    public get SelectedId() {
        return this._selectedId;
    }
    public set SelectedId(value) {
        this._selectedId = value;
        this.SelectedId$.next(this._selectedId)
    }
    public SelectedId$: BehaviorSubject<any> = new BehaviorSubject(this._selectedId);


    /**Список работников */
    public async GetMembers():Promise<IMember[]> {
        let mem = await this.trelloService.GetOrganizationAsync();
        let users:IMember[] = [];
        let promisses = [];
        for (let idMember = 0; idMember < mem[0].memberships.length; idMember++) {
            promisses.push(
                this.trelloService.GetMemberByIdAsync(mem[0].memberships[idMember].idMember)
                    .then(user => users.push(user))
            )

        }
        await Promise.all(promisses);
        users = users.sort((a, b) => {
            if (a.fullName.toString() < b.fullName.toString()) return -1;
            if (a.fullName.toString() > b.fullName.toString()) return 1;
            return 0;
        });
        //console.timeEnd("asyn")
        return users;
    }
}