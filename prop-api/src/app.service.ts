import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, Property, PropertyModel } from './db.model';

@Injectable()
export class AppService {

  constructor(@InjectModel('Email') private readonly emailModel: Model<Email>, 
  @InjectModel('Property') private readonly propertyModel: Model<Property>)
  { }
  getHello(): string {
    return 'Hello World!';
  }

   checkEmail(data: any){
    return this.emailModel.find({email:data.email}).exec();
  }

  async insertEmail(email:any){
    // const newEmail= new Email();
    // newEmail.email=email;
    const newEmailModel = new this.emailModel({email:email.email});
    try{
      const result = await newEmailModel.save();
      return result;
    }catch(err){
      throw new HttpException("Internal Server Error "+ err.message,HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }


  async insertProperty(property: PropertyModel){
    let result
    for(let i=0; i<property.house_list.length; i++){
      // let newProperty=  new Property();
      // newProperty.email=property.email;
      // newProperty.formatted_address=property.formatted_address;
      // newProperty.house_No=property.house_list[i];
      let newPropertyModel= new this.propertyModel({
        email:property.email,
        formatted_address: property.formatted_address,
        house_No: property.house_list[i]
      });
      try{
        result= await newPropertyModel.save();
        
      }catch(err){
        throw new HttpException("Internal Server Error "+ err.message,HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    return result;
  }
}
