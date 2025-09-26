import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageOrderEnum } from '../../constants/page-order.enum';
import { OrderByEnum } from '../../constants/order-by.enum';

export class PageOptionsDto {
  @IsEnum(PageOrderEnum)
  @IsOptional()
  readonly order?: PageOrderEnum = PageOrderEnum.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @IsEnum(OrderByEnum)
  @IsOptional()
  orderBy?: OrderByEnum;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
