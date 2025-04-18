import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';

@Injectable()
export class EmailsService {
  private client: postmark.ServerClient;
  constructor(private readonly configService: ConfigService) {
    this.client = new postmark.ServerClient(
      this.configService.get('postmark.apiKey'),
    );
  }

  private generateReachOutEmail({
    email,
    name,
    message,
  }: {
    email: string;
    name: string;
    message: string;
  }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Request Notification</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ededed;
            }
            .container {
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e0e0e0;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
              background-color: #ffffff;
              width: 100%;
            }
            .header {
              background-color: #2b72b8;
              padding: 25px;
              color: white;
              text-align: center;
            }
            .header h2 {
              margin: 0;
              font-weight: 300;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              background-color: #ffffff;
            }
            .content h3 {
              margin-top: 0;
              color: #444444;
              font-weight: 500;
            }
            .message-container {
              background-color: #f9f9f9;
              border-left: 4px solid #2b72b8;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 4px 4px 0;
            }
            .message-container h4 {
              margin-top: 0;
              color: #555555;
              font-weight: 500;
            }
            .footer {
              background-color: #f8f8f8;
              padding: 15px;
              text-align: center;
              color: #888888;
              font-size: 14px;
              border-top: 1px solid #eeeeee;
            }
            .reply-info {
              margin-top: 25px;
              padding: 15px;
              background-color: #edf5ff;
              border-radius: 4px;
            }
            .highlight {
              font-weight: 600;
              color: #2b72b8;
            }
            a {
              color: #2b72b8;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            @media only screen and (max-width: 480px) {
              body {
                  padding: 10px;
              }
              .container {
                  border-radius: 5px;
              }
              .header, .content, .footer {
                  padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Request Received</h2>
            </div>
            <div class="content">
              <h3>New request from <span class="highlight">${name}</span></h3>
              
              <div class="message-container">
                <h4>Message:</h4>
                <p>${message}</p>
              </div>
              
              <div class="reply-info">
                <p><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
              </div>
              
              <p>Please respond to this request at your earliest convenience.</p>
            </div>
            <div class="footer">
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  async sendEmail({ email, name, message }) {
    const htmlString = this.generateReachOutEmail({
      email,
      name,
      message,
    });
    return await this.client.sendEmail({
      From: 'noreply@danielwilder.dev',
      To: 'daniel@danielwilder.dev',
      Subject: `New Request Notification - ${name}!`,
      HtmlBody: htmlString,
    });
  }
}
