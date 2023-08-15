import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private generateAutoReply = ({
    originalMessage,
  }: {
    originalMessage: string;
  }): string => {
    const NEW_PARAGRAPGH = '\n\n';
    const greeting = 'Hi';
    const body = `I appreciate you taking the time to start a conversation.${NEW_PARAGRAPGH} I'll get back to you soon...`;
    const signOff = 'Thanks 🤙,\n Daniel Wilder';
    const context = `-----------\nYour Message:\n"${originalMessage}"`;

    return `${greeting}${NEW_PARAGRAPGH}${body}${NEW_PARAGRAPGH}${signOff}${NEW_PARAGRAPGH}${context}`;
  };

  async sendUserConfirmation({
    email,
    text,
    name,
  }: {
    email: string;
    text: string;
    name: string;
  }) {
    const promises: Promise<ReturnType<typeof this.mailerService.sendMail>>[] =
      [];
    // send confirmation to sender
    promises.push(
      this.mailerService.sendMail({
        to: email,
        from: this.configService.get('mailer.smtpUser'),
        subject: 'Thanks For Reaching Out',
        text: this.generateAutoReply({ originalMessage: text }),
        context: {
          name,
        },
      }),
    );
    // send message to Daniel
    promises.push(
      this.mailerService.sendMail({
        to: 'daniel@danielwilder.dev',
        from: email,
        subject: 'Portfolio Email',
        text: `${text}\nFrom, ${name}\nemail: ${email}`,
        context: {
          name,
          email,
        },
      }),
    );

    return await Promise.all(promises);
  }
}
