import { Module         } from '@nestjs/common';
import { AppController  } from './app.controller';
import { AppService     } from './app.service';
import { AnimalModule   } from './animal/animal.module'; // 👈 Add this ! (if not imported yet)
import { MongooseModule } from '@nestjs/mongoose';       // 👈 Add this !

@Module({
  imports: [
    AnimalModule, // 👈 Add this ! (if not imported yet)
    MongooseModule.forRoot( 'mongodb://localhost/animal' ) // 👈 Add this !
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
