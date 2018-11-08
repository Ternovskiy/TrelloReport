import { IMember } from "./IMember";
import { ICard } from "./ICard";

export interface IReportToday{
    User:IMember;
    CardToday:ICard[];
    CardNow:ICard[];
}