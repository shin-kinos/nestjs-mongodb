# nestjs-mongodb


<html>
  <body>
    <div style="display: flex; justify-content: center; align-items: center">
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

Apple M1 (macOS 14.3)

## Dependencies

* NestJS (version 10.4.5)
* MongoDB (db version v7.0.11)

## Set up NestJS

### 1. Install NestJS with `npm`

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

### 2. Create a new project



```
% nest g controller backend-animal
% nest g module     backend-animal
% nest g service    backend-animal
```

#### 3. Combine `controller` and `service` into `module`

Open `backend-animal.module.ts`

```
import { Module } from '@nestjs/common';
import { BackendAnimalController } from './backend-animal.controller';
import { BackendAnimalService } from './backend-animal.service';

@Module({
  controllers : [ BackendAnimalController ], // 👈 Add this!
  providers   : [ BackendAnimalService ]     // 👈 Add this!
})
export class BackendAnimalModule {}
```

#### 4. Modify `service`

Actual functions can be written in `service`. So opnen `backend-animal.service.ts`.

```
import { Injectable } from '@nestjs/common';

export interface Animal {
  name           : string,
  scientificName : string
}

@Injectable()
export class BackendAnimalService {

  private animals: Animal[] = [
    {
      name           : 'Dog',
      scientificName : 'Canis lupus familiaris'
    },
    {
      name           : 'Cat',
      scientificName : 'Felis catus'
    },
    {
      name           : 'Chicken',
      scientificName : 'Gallus gallus'
    },
    {
      name           : 'Nematode',
      scientificName : 'C. elegans'
    },
    {
      name           : 'Fruit fly',
      scientificName : 'Drosophila melanogaster'
    }
  ];

  getAnimals() { // 👈 Write function here!
    console.log( 'The back-end called getAnimals() function!' );
    return this.animals;
  }
}

```

#### 5. Modify `controller`

`Controller` can be a router of the function. Open `backend-animal.controller.ts`

```
import { Controller, Get              } from '@nestjs/common';
import { BackendAnimalService, Animal } from './backend-animal.service';

@Controller( 'backend-animal' ) // 👈 'backend-animal' will be the route
export class BackendAnimalController {

  constructor( private backendAnimalService: BackendAnimalService ) {}

  @Get() // 👈 Set @Get here
  getAnimals(): Animal[] {
    return ( this.backendAnimalService ).getAnimals();
  }
}
```

#### 6. <span style="color: red; background-color: yellow; font-weight: bold">IMPORTANT:</span> Enable CORS

Add `add.enableCors()` in `main.ts` or the nasty 'Access-Control-Allow-Origin' error will happen! Open `main.ts` and:

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 🔥🔥🔥🔥🔥 IMPORTANT: Add app.enableCors() here or the
  // nasty 'Access-Control-Allow-Origin' Error happens!
  app.enableCors(); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

#### 7. Run NestJS

```
% npm run start 
```

## Set up Angular

Basically Front-End side is the same as the general Angular components, but networking with Back-End are done by `serive`:

#### 1. Create example component

Type `ng generate component frontend-animal`. And make `service` file as well.

```
% ng generate component frontend-animal
% cd frontend-animal
% ng generate service frontend-animal # create service file
```

#### 2. Modify `frontend-animal.service.ts`

HTTP client handling (e.g., `this.httpClient.get( 'localhost://.../' )`) is done in `service`. So open `frontend-animal.service.ts`.

```

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontendAnimalService {

  constructor( private httpClient: HttpClient ) {}

  private handleError( error: HttpErrorResponse ) {
    /*
     * If the Back-End returns an unsuccessful code;
     * the response body may contain clues as to what went wrong.
    */
    console.error( `Bah! The Back-End returns code ${ error.status }! The body is:`, error.error );
    // Returns the error message thrown
    return throwError(
      () => new Error( 'Bah! Something bad happend! Please try again later on!' )
    );
  }

  // Get animals' data from http://localhost:3000/backend-animal/
  getAnimals(): any {
    return this.httpClient.get( 'http://localhost:3000/backend-animal/', { responseType: 'json' } )
      .pipe(
        retry( 5 ),                    // Try 5 times if unsuccessfull
        catchError( this.handleError ) // If unsuccessfull after 5 tries; go to errorHandling
      );
  }

}

```

#### 3. Modify `frontend-animal.component.ts`

Then you can call the function from `frontend-animal.component.ts`. Open it:

```
import { Component } from '@angular/core';
import { FrontendAnimalService } from './frontend-animal.service';

// Import Animals Interface from 'Back-End/src/modules/backend-animal/backend-animal.service.ts'
import { Animal } from './../../../../../Back-End/src/modules/backend-animal/backend-animal.service';

@Component({
  selector: 'app-frontend-animal',
  standalone: true,
  imports: [],
  templateUrl: './frontend-animal.component.html',
  styleUrl: './frontend-animal.component.scss'
})
export class FrontendAnimalComponent {

  animals: any;

  constructor( private frontendAnimalService: FrontendAnimalService ) {}

  getAnimals() {
    this.frontendAnimalService.getAnimals()
      .subscribe( ( data: Animal ) => {
        this.animals = data;
        console.log( 'The Front-End received the data!:', this.animals );
      } );
  }

}
``` 

### 4. <span style="color: red; background-color: yellow; font-weight: bold">IMPORTANT:</span> Set following code block in `app.config.ts`.

Or HTTP Client connection with NestJS will not be successfull!!

```
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // 👈 Add this!

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient()]
}; // 👈 Add this!

```
PAT: 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
