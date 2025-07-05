import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    let salt= await bcrypt.genSalt();
    return await bcrypt.hash(password,salt);
  }

  async comparePassword(
    plainPassword: string | Buffer,
    hashedPassword: string | Buffer,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword,hashedPassword);  
  }
}
