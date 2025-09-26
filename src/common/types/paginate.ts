import { SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from '../dto/page-meta.dto';

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pageOptionsDto: PageOptionsDto,
): Promise<PageDto<T>> {
  const orderBy = pageOptionsDto.orderBy || `createdAt`;

  const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take || 0;

  queryBuilder
    .orderBy(`${queryBuilder.alias}.${orderBy}`, pageOptionsDto.order)
    .skip(skip)
    .take(pageOptionsDto.take);

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  return new PageDto(entities, pageMetaDto);
}
