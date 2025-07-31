import { OtpPurpose } from '../otp/enums/otp-purpose.enum';

export class SendOtpEmailEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly purpose: OtpPurpose,
  ) {}
}
