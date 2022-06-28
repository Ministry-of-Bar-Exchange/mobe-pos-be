import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
const axios = require('axios').default;

@Module({
  imports: [ConfigModule],
  controllers: [CmsController],
  providers: [CmsService,
    {
      provide: 'HTTP_CMS',
      useFactory: (configService: ConfigService): AxiosInstance => {
        const baseURL = 'https://mobe-cms.herokuapp.com/api/'
        const config = {
          baseURL,
          // headers: {
          //   authorization: `Bearer ${key}`,
          // },
        };
        const http = axios.create(config);
        return http;
      },
      inject: [ConfigService],
    },
  ],
  exports: [CmsService],
})


export class CmsModule { }
