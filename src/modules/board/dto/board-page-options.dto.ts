import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';

export class BoardPageOptionsDto extends PageOptionsDto {
  @IsEnum(BoardMemberRole)
  @IsOptional()
  role: BoardMemberRole;
}
