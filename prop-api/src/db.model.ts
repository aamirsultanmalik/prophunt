import * as mongoose from 'mongoose';

export class Email extends mongoose.Document{
    id: string;
    email: string;
}
export const EmailSchema = new mongoose.Schema({
    email:{type:String, required: true},
});

export class Property extends mongoose.Document{
    id: string;
    email: string;
    formatted_address: string;
    house_No:string;
}
export const PropertySchema = new mongoose.Schema({
    email:{type:String, required: true},
    formatted_address:{type:String, required: true},
    house_No:{type:String, required: true},
});

export class PropertyModel {
    email: string;
    formatted_address: string;
    house_list:string[];
  }