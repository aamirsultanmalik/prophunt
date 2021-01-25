import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
// import { Email, Property, PropertyModel } from './db.model'; //mongodb
import { Property , PropertyModel} from "./mysqldb.model";

@Injectable()
export class AppService {

  constructor(@InjectRepository(Property)
  private propRepository: Repository<Property>){

  }


  //mongo db
  // constructor(@InjectModel('Email') private readonly emailModel: Model<Email>, 
  // @InjectModel('Property') private readonly propertyModel: Model<Property>)
  // { }
  getHello(): string {
    return 'Hello World!';
  }

  //mongodb 

  //  checkEmail(data: any){
  //   return this.emailModel.find({email:data.email}).exec();
  // }
 
  //mongodb 
  // async insertEmail(email:any){
  //   const newEmailModel = new this.emailModel({email:email.email});
  //   try{
  //     const result = await newEmailModel.save();
  //     return result;
  //   }catch(err){
  //     throw new HttpException("Internal Server Error "+ err.message,HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  // }

  //mongodb

  // async insertProperty(property: PropertyModel){
  //   let result
  //   for(let i=0; i<property.house_list.length; i++){
  //     let newPropertyModel= new this.propertyModel({
  //       email:property.email,
  //       formatted_address: property.formatted_address,
  //       house_No: property.house_list[i]
  //     });
  //     try{
  //       result= await newPropertyModel.save();
        
  //     }catch(err){
  //       throw new HttpException("Internal Server Error "+ err.message,HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
    
  //   return result;
  // }


  async insertProperty(property: PropertyModel){
    let result
    for(let i=0; i<property.house_list.length; i++){
      
      // let newPropertyModel= new this.propRepository({
      //   email:property.email,
      //   formatted_address: property.formatted_address,
      //   house_No: property.house_list[i]
      // });
      try{
        let tempProp = this.propRepository.create();
      tempProp.email =property.email;
      tempProp.formatted_address=  property.formatted_address;
      tempProp.house_No=  property.house_list[i];
      result = await this.propRepository.save(tempProp);
        // result= await newPropertyModel.save();
        
      }catch(err){
        throw new HttpException("Internal Server Error "+ err.message,HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    return result;
  }
}
