import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../auth/local.auth.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { invitationCodesDto } from "./dto/invitation-codes.dto";
import { InvitationCodesService } from "./invitation-codes.service";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../auth/role.enum";
import { RolesGuard } from "../auth/role.guard";
import { InvitationCodes } from "./schemas/invitation-codes.schema";

@ApiTags('invitation')
@Controller('invitation')
export class InvitationCodesController {
  constructor(private invitationCodesService: InvitationCodesService) {}

  @Get('code/:userId')
  @Roles(UserRole.INVESTOR)
  @UseGuards(RolesGuard)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, type: [invitationCodesDto] })
  async getInvestorInvitationCode(@Param('userId') userId: string): Promise<InvitationCodes> {
    return this.invitationCodesService.getInvitationCodeById(userId);
  }
}
