import { ApiProperty } from "@nestjs/swagger";

export class  CreateRestaurantDto{
    @ApiProperty({ required: true })
    firmName:string;
    @ApiProperty({ required: true })
    outletName:string;
    @ApiProperty({ required: true })
    address:string;
    @ApiProperty({ required: true })
    taxId:string;
    @ApiProperty({ required: true })
    taxIdType:string;
    @ApiProperty({ required: false })
    dayClosingDate ?: string
}