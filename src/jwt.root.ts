import { JwtModule } from '@nestjs/jwt';

export const jwtRoot = JwtModule.register({
  global: true,
  secret: process.env.SECRET_JWT,
  signOptions: { expiresIn: '1m' },
});
