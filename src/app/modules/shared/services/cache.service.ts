import { Injectable } from "@angular/core";

@Injectable()
export class CacheService {

    constructor() {

    }
    public SetCache(key, value, minuts: number = null) {
        if (!value || value.error) { return; }
        // localStorage[key] = JSON.stringify(value);
        let cache = new CacheModel(value, minuts);
        localStorage[key] = JSON.stringify(cache);
    }
    public GetCache(key) {
        //return undefined;
        if (localStorage[key]) {
            // return JSON.parse(localStorage[key]);
            let cache: CacheModel = JSON.parse(localStorage[key]);
            if (!cache.DateStart || !cache.DateEnd || new Date(cache.DateEnd) < new Date(Date.now())) {
                localStorage.removeItem(key);
                return undefined;
            }
            return cache.Value;
        }
        return undefined;
    }
}

class CacheModel {
    DateStart: Date;
    DateEnd: Date;
    Value: any;

    constructor(value: any, minuts: number) {
        this.Value = value;
        this.DateStart = new Date(Date.now());
        this.DateEnd = new Date(Date.now());
        if (minuts) {
            this.DateEnd.setMinutes(this.DateEnd.getMinutes() + minuts);
        } else {
            this.DateEnd.setHours(this.DateEnd.getHours() + 48);
        }
    }
}