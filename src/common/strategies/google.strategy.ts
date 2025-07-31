import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleOAuthUser } from '../interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    try {
      const { id, name, emails, photos, displayName } = profile;

      const user: GoogleOAuthUser = {
        id,
        email: emails?.[0]?.value ?? '',
        firstName:
          name?.givenName || displayName ? displayName.split(' ')?.[0] : '',
        lastName:
          name?.familyName || displayName ? displayName.split(' ')?.[1] : '',
        picture: photos?.[0]?.value || '',
        accessToken,
        refreshToken,
      };

      console.log({ accessToken });
      console.log({ refreshToken });
      console.log({ profile });

      done(null, user);
    } catch (error) {
      return done(error as Error, false);
    }
  }
}
