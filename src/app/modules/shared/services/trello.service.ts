import { Injectable } from "@angular/core";
import { IMember } from "../Interfaces/IMember";
import { IList } from "../Interfaces/IList";
import { IBoardField } from "../Interfaces/IBoardField";
import { IOrganization } from "../Interfaces/IOrganization";
import { ICardField } from "../Interfaces/ICardField";
import { ICardAction } from "../Interfaces/ICardAction";
import { ICard } from "../Interfaces/ICard";
import { CacheService } from "./cache.service";

@Injectable()
export class TrelloService {

    constructor(public cacheSevice : CacheService) { }
    prefix = 'https://api.trello.com/1';
    addGet = '?key=f8c8451e9b73a28599c78ed926a4dcad&token=7ad73270600416aafb030658bd53ea87e668468c00df218ba4d18454c5def355';

    private _get(url) {
        var request = new XMLHttpRequest();
        // request.open('GET', this.prefix + url + this.addGet, false); // `false` makes the request synchronous
        request.open('GET', this.prefix + url + this.addGet, false); // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        }
    };

    private _sleepAsync(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }
    private _awaitRequest:boolean=false;
    private async _getAsync(url) {
        // let response = await fetch(this.prefix + url + this.addGet);
        while (this._awaitRequest) {
            await this._sleepAsync(300);
        }
        let response = await fetch(this.prefix + url + this.addGet);

        let data = await response.json();
        if (data.error) {
            console.log(data);
            if (data.message == 'Rate limit exceeded') {
                this._awaitRequest=true;
                await this._sleepAsync(200);
                this._awaitRequest=false;
                return await this._getAsync(url);
            }
        }
        return data;
    }

    /**Вернет карточки по ид юзера */
    public async GetCardMemberAsync(id):Promise<ICard[]> {
            return this._getAsync("/member/" + id + "/cards");
    }

    /** организация, все юзеры орг */
    public async GetOrganizationAsync():Promise<IOrganization[]> {
        return this._getAsync("/member/me/organizations");
    }

    /**Юзер по ид */
    public async GetMemberByIdAsync(id:string): Promise<IMember> {
        // let cache = this._getCache('mem' + id);
        let cache = this.cacheSevice.GetCache('mem' + id);
        if (cache) {
            return cache;
        }
        let u:IMember = await this._getAsync("/member/" + id);
        this.cacheSevice.SetCache('mem' + id, u);
        return u;
    }

    /** Кастомные поля с доски на которой карточка */
    public async GetBoardFieldsAsync(card:ICard):Promise<IBoardField[]> {
        if (!!card._boardFields) {
            return card._boardFields;
        }
        let cashe = this.cacheSevice.GetCache('boardFields' + card.idBoard);
        if (cashe) {
            card._boardFields = cashe;
            return card._boardFields;
        }
        let dataBoardFields = await this._getAsync("/boards/" + card.idBoard + "/customFields");
        this.cacheSevice.SetCache('boardFields' + card.idBoard, dataBoardFields);
        card._boardFields = dataBoardFields;
        return card._boardFields;
    }

    /** Поля на карточке   */
    public async GetCardFieldsAsync(card:ICard):Promise<ICardField[]> {
        return this._getAsync("/cards/" + card.id + "/customFieldItems");
    }

    /**Список карточки */
    public async GetCardListAsync(card:ICard):Promise<IList> {
        if (!!card._list) {
            return card._list;
        }
        let cache = this.cacheSevice.GetCache('list' + card.idList);
        if (cache) {
            card._list = cache;
            return card._list;
        }
        card._list = await this._getAsync(`/lists/${card.idList}`);
        this.cacheSevice.SetCache('list' + card.idList, card._list);
        return card._list;
    }

    /** Получить действия карточки */
    public async GetActionCardAsync(cardId):Promise<ICardAction[]> {
        return this._getAsync("/cards/" + cardId + "/actions");
    }
}