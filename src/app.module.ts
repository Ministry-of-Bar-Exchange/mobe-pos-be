import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

// import { AuthModule } from './auth/auth.module'; // will not include in app temporarily
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "users/users.module";
import { ProductsModule } from "./products/products.module";
import { CategoryModule } from "./category/category.module";
import { SubCategoryModule } from "./sub-category/sub-category.module";
import { AuthModule } from "Auth/auth.module";
import { BillingModule } from './billing/billing.module';
import { TablesModule } from './tables/tables.module';
import { OrderModule } from "orderItem/orderItem.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: (() => {
            return config.get("EMAIL_HOST");
          })(),
          secure: false,
          auth: {
            user: config.get("EMAIL_USER"),
            pass: config.get("EMAIL_PASSWORD"),
          },
        },
        defaults: {
          from: config.get("EMAIL_FROM"),
        },
        // tls: {
        //   secureProtocol: 'TLSv1_method',
        // },
        // defaults: {
        //   from: '<sendgrid_from_email_address>',
        // },
        // template: {
        //   dir: join(__dirname, '/templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoryModule,
    SubCategoryModule,
    BillingModule,
    TablesModule,
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
