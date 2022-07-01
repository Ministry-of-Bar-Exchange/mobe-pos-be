import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({
        type: String,
        unique: true,
        isRequired: true
    })
    email: string;

    @Prop()
    password: string;

    @Prop()
    phoneNumber: number;

    @Prop()
    accessToken: string;

    @Prop({ default: false })
    isBlocked: boolean;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
