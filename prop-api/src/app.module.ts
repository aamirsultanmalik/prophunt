import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailSchema, PropertySchema } from './db.model';
import { Property } from './mysqldb.model';

@Module({
  imports: [
    // code for mongodb connection 

    // MongooseModule.forRoot('mongodb+srv://aamir:aamir@nestjs.ayatn.mongodb.net/prop_hunt-db?retryWrites=true&w=majority'),
    // MongooseModule.forFeature([
    //   {name:'Email',schema:EmailSchema},
    //   {name:'Property',schema:PropertySchema}
    // ]),

    // code for mysql connection 

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: '',
      password: '',
      database: 'test',
      entities: [Property],
    }),

    TypeOrmModule.forFeature([Property])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
