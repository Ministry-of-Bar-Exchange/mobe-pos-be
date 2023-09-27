import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
    ) { }

    sendEmail(config) {
        return this.mailerService
            .sendMail(config)
            .then((res) => console.debug(res, '\n res \n'))
            .catch((err) => console.error(err, '\n err \n'));
    }

    adminBulkUpload(uploadStatus) {
        const { successful = [], failed = [] } = uploadStatus;
        const successfulCount = successful?.length;
        const failedCount = failed?.length;

        const emailConfig = {
            to: 'shubhomadmin@yopmail.com',
            subject: 'Results: Create users with bulk upload',
            // template: './admin/bulkUpload_success',
            html: `<p>Hey Admin,</p>
             <p>You have successfully created ${successfulCount} user's with bulk upload.</p>            
            <p>unfortunately there were ${failedCount || 0} failed uploads as well.</p>`,
            // context: {
            //     name: 'Admin',
            //     successfulCount,
            //     failedCount,
            // }
        }
        return this.sendEmail(emailConfig);
    }

    userSignUpSuccess(usersList = []) {
        if (usersList?.length) {
            const emailRequests = usersList.map((user) => {
                const { email, firstName, lastName, _id } = user;
                const emailConfig = {
                    to: email,
                    subject: 'Congratulation, Successful signup',
                    html: `<p> Hi <b>${firstName} ${lastName}</b>,</p>
                    <p> Welcome to <b>Leave Management Solutions</b>.</p>
                    
                    <p>
                        As you are now a subscriber, I would like to welcome you aboard personally.
                        To get started we would like you to change your password first, you can click on the below link for same
                        <a href="${'http://localhost:3001/users/reset-password?id=${_id}'}"> click here </a>
                    </p>
                    
                    <p>
                        Regards
                        <br />
                        Admin
                        <br />
                        admin@yopmail.com
                    </p>`,

                    // template: './users/signUp_success',
                    // context: {
                    //     name: `${firstName} ${lastName}`,
                    //     organization: 'Employee management Solutions',
                    //     url: `http://localhost:3001/users/reset-password?id=${_id}`
                    // }
                }

                return this.sendEmail(emailConfig);
            });
            return Promise.all(emailRequests);
        }

    }
}