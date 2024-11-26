import { Module               } from '@nestjs/common';
import { AnimalController     } from './animal.controller';
import { AnimalService        } from './animal.service';
import { MongooseModule       } from '@nestjs/mongoose'; // 👈 Add this !
import { Animal, AnimalSchema } from './animal.schema';  // 👈 Add this !

@Module({
  imports: [ MongooseModule.forFeature( [ { name: Animal.name, schema: AnimalSchema } ] ) ], // 👈 Add this !
  controllers: [AnimalController],
  providers: [AnimalService]
})
export class AnimalModule {}
