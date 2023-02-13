import { IElements } from "app/modules/admin/pages/planing/models/element";
import { IProjectFolder } from "app/modules/admin/pages/planing/models/project-folder";
import { Contractor } from "./contractort";
import { IHiringData } from "./hiring-data";

export interface Minuta{
    contractor: Contractor;
    elementosComponente: IElements;
    hiringData: IHiringData;
    contract: IProjectFolder;
}