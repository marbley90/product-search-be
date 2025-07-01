import { ApiProperty } from "@nestjs/swagger";

export class IndexProductsResponseDto {
  @ApiProperty({ example: 3 })
  indexed: number;

  @ApiProperty({ example: false })
  errors: boolean;
}
