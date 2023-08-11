import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/auth/guards/apikey.guard';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('/reachOut')
  @UseGuards(ApiKeyGuard)
  async reachOut(
    @Body()
    { name, email, message }: { name: string; email: string; message: string },
  ) {
    console.log('HELLOE');
    return await this.emailsService.createContactMessage({
      message,
      email,
      name,
    });
  }
}
