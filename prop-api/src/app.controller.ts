import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PropertyModel } from './db.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Post('checkEmail')
  // checkEmail(@Body() email: any){
  //   return this.appService.checkEmail(email);
  // }
  
  // @Post('insertEmail')
  // insertEmail(@Body() email: string){
  //   return this.appService.insertEmail(email);
  // }
  
  @Post('insertProperty')
  insertProperty(@Body() property: PropertyModel){
    return this.appService.insertProperty(property);
  }
}
