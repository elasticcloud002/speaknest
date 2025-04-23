import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      from: 'speakeasyandpurge@yahoo.com', // override default from
      subject: 'PIN retrieval',
      template: './confirmation',
      context: {
        code: code,
        email: email,
      },
    });
  }

  async sendMembership(email: string, full_name: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'speakeasyandpurge@yahoo.com', // override default from
      subject: 'Membership',
      html: `
                <p>Hello</p>
                <p>Dear ${full_name}, welcome to the community! This email is to let you know we've received and are responding to your membership request. We'll get back to you in due course. </p>
                <p></p>
                <p>Thank you,</p>
                <p>The Speakeasy and Purge Team.</p>

            `,
      // template: './membership',
      // context: {
      //     email: email,
      //     full_name: full_name
      // },
    });
  }

  async sendCustomerPaymentSuccess(userEmail: string) {
    await this.mailerService.sendMail({
      to: 'peakeasyandpurge@yahoo.com',
      from: 'peakeasyandpurge@yahoo.com',
      subject: 'Payment Success',
      html: `
        <h3>Payment Success</h3>
        <p>From User Email: ${userEmail}</p>
      `,
    });
  }
}
