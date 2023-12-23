import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from './user.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser() {
    const start = dayjs(
      dayjs().subtract(30, 'seconds').format('YYYY-MM-DD HH:mm:ss'),
      'YYYY-MM-DD HH:mm:ss',
    );
    const end = dayjs(
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
      'YYYY-MM-DD HH:mm:ss',
    );
    const exisingUser = await this.userRepository.find({
      where: {
        created_at: Between(
          start.format('YYYY-MM-DD  HH:mm:ss.000000'),
          end.format('YYYY-MM-DD  HH:mm:ss.000000'),
        ),
      },
    });
    console.log(`existing user count ${exisingUser.length} `);

    if (exisingUser.length > 0) {
      throw new HttpException(
        'Last user  is created less than 30 seconds',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userRepository.save({
      name: 'test',
      email: 'test@mail.com',
    });
  }
}
