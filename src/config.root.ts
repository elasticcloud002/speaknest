import { ConfigModule } from '@nestjs/config';
import { getEmitFromWatchHost } from 'ts-loader/dist/instances';
import { keys } from 'lodash';

export const configRoot = ConfigModule.forRoot({
  envFilePath: ['.env'],
  isGlobal: true,
});
