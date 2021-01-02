import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailSchema, PropertySchema } from './db.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://aamir:aamir@nestjs.ayatn.mongodb.net/prop_hunt-db?retryWrites=true&w=majority'),
    MongooseModule.forFeature([
      {name:'Email',schema:EmailSchema},
      {name:'Property',schema:PropertySchema}
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
