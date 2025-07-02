import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { SearchResultDto } from "./dto/search-result.dto";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: "Search products by keyword" })
  @ApiQuery({
    name: "q",
    type: String,
    required: true,
    description: "Search query string",
  })
  @ApiResponse({
    status: 200,
    description: "List of matched products",
    type: [SearchResultDto],
  })
  async search(@Query("q") q: string) {
    try {
      return this.searchService.searchProducts(q);
    } catch (error) {
      console.error(
        `An error occurred during searching products with query ${q}`,
        error,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
