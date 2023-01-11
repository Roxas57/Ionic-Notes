import { Photo } from "@capacitor/camera"

export interface Note{
    id?:string,
    title:string,
    description:string,
    ubicacion?:String,
    foto?:String,
    hided?:boolean
}