import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { randomBytes } from 'node:crypto';
import { CipherToken } from './cipher-token.entity';

@Injectable()
export class CipherTokenRepository extends Repository<CipherToken> {
  constructor(private readonly dataSource: DataSource) {
    super(CipherToken, dataSource.manager);
  }

  async generateToken(data: any): Promise<CipherToken> {
    const token = this.create({
      userId: data?.userId,
      token: data?.token || randomBytes(32).toString('hex'),
      userAgent: data?.userAgent,
      ipAddress: data?.ipAddress,
      type: data.type,
      currency: data?.currency,
      expireAt:
        data?.duration &&
        DateTime.now()
          .plus({
            seconds: data.duration,
          })
          .toJSDate(),
    });

    return this.save(token);
  }

  async findValidToken(param: Partial<CipherToken>): Promise<CipherToken> {
    const now = new Date();

    const token = await this.createQueryBuilder('token')
      .where(param)
      .andWhere('token.expire_at > :now', { now })
      .orderBy('token.created_at', 'DESC')
      .getOne();

    return token;
  }
}
