# nestjs-mongodb

<html>
  <body>
    <div>
      <span>
        <img src="https://thumbs.bfldr.com/at/h5psv9c3jbk88pwc3xn79pp/v/1069931061?expiry=1733224385&fit=bounds&height=162&sig=YzcyY2VlMzgyMWU1YmNhYWMxMTU4NGY3MmU3NTczODhmODc2YTYyOA%3D%3D&width=262">
        </span>
        <span>
          <img src="https://github.com/nestjs/nestjs.com/blob/b41f0bd9b4d19a604e1a42a85caa3407dd4b8845/img/logo.png?raw=true">
        </span>
    </div>
  </body>
</html>

## Description

* This is a tutorial explains how to interact NestJS with MongoDB
* Step-by-step instruction to implement NestJS connectiong with MongoDB on localhost
* Enjoy

## Test Environment

* Apple M1 (macOS 14.3)
	* NestJS (version 10.4.5)
	* MongoDB (db version v7.0.11)

## Set up NestJS with Mongoose

### 1. Set up NestJS

#### 1-A. Install NestJS with `npm`

Install `@nestjs/cli`:

```
npm i @nestjs/cli
```

and `@nestjs/common`:

```
npm i @nestjs/common
```

Then check if it is installed, e.g.,:

```
nest --version
```

#### 1-B. Create a new project

Create a new project with a project name - e.g., `nestjs-animal`

```
nest new nestjs-animal
```

#### 1-C. Create a new module

Create a new module with a module name - e.g., `animal` - go to `nestjs-animal/src` and create module `animal`

```
cd nestjs-animal/src
```

```
nest g module animal
```

And create the controller:

```
nest g controller animal
```

And the service;

```
nest g service animal
```

Check the following files were generated in `animal` dir:

* `animal.controller.spec.ts`
* `animal.module.ts`
* `animal.service.ts`
* `animal.controller.ts`
* `animal.service.spec.ts`

### 2. Set up Mongoose in NestJS

#### 2-A. Install Mongoose

To interact NestJS with MongoDB, a npm package `mongoose` is used - go back to `nestjs-animal` dir and install `@nestjs/mongoose` and `mongoose` with `npm`:

```
npm i @nestjs/mongoose
```

```
npm i mongoose
```

#### 2-B. Create a schema for MongoDB

Create a schema file (e.g., `animal.schema.ts`) in `animal` dir for MongoDB storage:

```
cd src/animal
```

```
touch animal.schema.ts
```

#### 2-C. Create a MongoDB Schema Factory

The schema factory define a class in `animal.schema.ts` so that they can be interactive with a JSON format data - open `animal.schema.ts` and modify it as follows:

```
// ✅ This is animal.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnimalDocument = HydratedDocument<Animal>;

@Schema()
  export class Animal {
    @Prop()
    name: string;

    @Prop()
    scientificName: string;
  }

export const AnimalSchema = SchemaFactory.createForClass( Animal );
```

A class `Animal` is defined containing 2 properties (`@Props`): `name` and `scientificName`, which is converted to the schema by `SchemaFactory.createForClass`.

#### 2-D. Import the schema to the module

Open `animal.module.ts` and modify it as follows to import `Animal` schema:

```
// ✅ This is animal.mosule.ts

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

```

#### 2-E. Create functions to register/fetch the data from MongoDB

Define 2 functions (`registerAnimal()` and `getAllAnimals()`) in `animal.service.ts` to add and fetch the data from MongoDB as follows:

```
// ✅ This is animal.service.ts

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
```

#### 2-F. Modify the controller

The controller can be a router of the function - open `animal.controller.ts` and set `@Get` and `@Post` to call those 2 functions in `animal.service.ts`:

```
// ✅ This is animal.controller.ts
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

```

#### 2-G. Set root path of the module

Import `Animal` module and the MongoDB's path (will be mentioned later on) to `app.module.ts` - go back to `src` dir and modify `app.module.ts` as follows:

```
// ✅ This is app.module.tst

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

```

Well done! 🎉 Now NestJS is ready to interact with MongoDB!

## Set up MongoDB

### 1. Optional: Install MongoDB

Install MongoDB if it is not done to your enviroment yet - here is an example to do by getting a source and binary from the official WEB site with `wget` commands.

```
wget https://fastdl.mongodb.org/osx/mongodb-macos-arm64-7.0.11.tgz
```

**⚠️ Note that the URL above is for <span style="text-decoration:underline;color:red;">macOS ARM 64</span>, please set a proper one for your own environemnt (visit https://www.mongodb.com/try/download/community).**

Then, extract the tarball file:

```
tar -xvzf mongodb-macos-arm64-7.0.11.tgz
```

The binary file `mongod` should be in `./mongodb-macos-aarch64-7.0.11/bin` dir - check if it is correctly installed and does work on your environment, if neccessary, e.g.,:

```
cd mongodb-macos-aarch64-7.0.11/bin
```

```
mongod --version
```

### 2. Run MongoDB

Optional: Make a new dir in any name which will be a data dir of MongoDB, e.g.,:

```
mkdir database
```

Then, run the MongoDB with port `27017` - **make sure port `27017` is available in your environment**:

```
mongod --port 27017 --dbpath database
```

Now MongoDB should start running!

## Play through NestJS with MongoDB

Finally, let's play through NestJS interacting with MongoDB by using `curl` command.

### 1. Optional: npm install

Install required libraries with `npm`, if it has not been done yet:

```
cd nestjs-animal
```

```
npm install
```

### 2. Run NestJS

Start `nestjs-animal` - **make sure NestJS is ready to be interactive with MongoDB with the example code above, and MondoDB is running on port `27017`**:

```
npm run start
```

If no issues, well done!🎉 Finally the product is deployed!

### 3. Register an animal name

Let's register an animal name as JSON data as `{name:<string>,scientificName:<string>}` with `curl` command - open another terminal and type the following the example command:

```
 curl -X POST -H 'Content-Type: application/json' -d '{"name":"Human","scientificName":"Homo Sapiens"}' http://localhost:3000/animal/register
```

that tries to interact NestJS to POST the data of name and scientific name (Human, Homo Sapiens), being registered in MongoDB.

If successful, the a response should look like as follows:

```
{"name":"Human","scientificName":"Homo Sapiens","_id":"674d80b6bc8eacfc6a336e48","__v":0}%  
```

### 4. Fetch stored animal names from MongoDB

You can also fetch the data stored in the MongoDB - type the following the example command:

```
curl -X GET http://localhost:3000/animal/get-all
```

If successful, the a response should look like as follows:

```
[{"_id":"674d80b6bc8eacfc6a336e48","name":"Human","scientificName":"Homo Sapiens","__v":0}]
```

Enjoy😎
