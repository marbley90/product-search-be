import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IndexProductsResponseDto } from "./dto/index-products-response.dto";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Index one or more products into Elasticsearch" })
  @ApiBody({ type: [CreateProductDto] })
  @ApiResponse({
    status: 201,
    description: "Products indexed successfully",
    type: IndexProductsResponseDto,
  })
  async createProducts(@Body() products: CreateProductDto[]) {
    try {
      return this.productsService.indexProducts(products);
    } catch (error) {
      console.error(`An error occurred during adding products`, error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
