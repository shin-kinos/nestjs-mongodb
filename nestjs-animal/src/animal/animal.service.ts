import { Injectable, Logger } from '@nestjs/common'; // 👈 Add this !
import { InjectModel } from '@nestjs/mongoose';      // 👈 Add this !
import { Model } from 'mongoose';                    // 👈 Add this !
import { Animal } from './animal.schema'             // 👈 Add this !

@Injectable()
export class AnimalService {
  constructor( @InjectModel( Animal.name ) private animalModel: Model<Animal> ) {} // 👈 Add this !

  // 👇 Add this code block !
  async registerAnimal( animal: Animal ): Promise<any> {
    Logger.log( 'NestJS called registerAnimal() function!' );
    const  result = await this.animalModel.create( animal ); // Register a new Animal data to MongoDB
    return result;
  }

  // 👇 Add this code block !
  async getAllAnimals(): Promise<Animal[]> {
    Logger.log( 'NestJS called getAllAnimals() function!' );
    const  result =  await this.animalModel.find(); // Fetch all the Animal data from MongoDB
    return result;
  }
}
