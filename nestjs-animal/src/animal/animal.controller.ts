
import { Controller, Get, Post, Body } from '@nestjs/common';   // 👈 Modify this !
import { AnimalService               } from './animal.service'; // 👈 Add this !
import { Animal                      } from './animal.schema';  // 👈 Add this !

@Controller( 'animal' ) // The path will be `http://localhost:3000/animal`
export class AnimalController {
  constructor( private animalService: AnimalService ) {} // 👈 Add this !

  // 👇 Add this code block !
  @Get( 'get-all' ) // The path will be `http://localhost:3000/animal/get-all`
  async getAllAnimals(): Promise<Animal[]> {
    return ( this.animalService ).getAllAnimals();
  }

  // 👇 Add this code block !
  @Post( 'register' ) // The path will be `http://localhost:3000/animal/register`
  async registerAnimal( @Body() animal: Animal ): Promise<any> {
    return ( this.animalService ).registerAnimal( animal );
  }

}
