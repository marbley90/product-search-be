import { ApiProperty } from "@nestjs/swagger";

export class SearchResultDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  score: number;
}
