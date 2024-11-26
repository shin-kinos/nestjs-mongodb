
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnimalDocument = HydratedDocument<Animal>;

@Schema()
  export class Animal {
    @Prop( { required: true } )
    name: string;

    @Prop( { required: true } )
    scientificName: string;
  }

export const AnimalSchema = SchemaFactory.createForClass( Animal );
