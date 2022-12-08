import { Test } from '@nestjs/testing';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';

import { AuthService } from './auth.service';
import { DatabaseModule } from './../database/database.module';
import { UsersModule } from './../components/users/users.module';
import { CreateUserDto } from './../components/users/user.dto';

//import { getRepositoryToken } from '@nestjs/typeorm';
//import { UsersService } from './../components/users/users.service';
//import { User } from './../components/users/user.entity';

describe('El servicio de Auth', () => {
  let authenticationService: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            POSTGRES_HOST: Joi.string().required(),
            POSTGRES_PORT: Joi.number().required(),
            POSTGRES_USER: Joi.string().required(),
            POSTGRES_PASSWORD: Joi.string().required(),
            POSTGRES_DB: Joi.string().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_EXPIRATION_TIME: Joi.string().required(),
            PORT: Joi.number(),
          }),
        }),
        DatabaseModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
            },
          }),
        }),
      ],
      providers: [AuthService],
    }).compile();
    authenticationService = await module.get<AuthService>(AuthService);
  });

  describe('Crear Cookie', () => {
    it('Debe de devolver cookie', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });

    it('Debe de devolver un String de Logout', () => {
      expect(typeof authenticationService.getCookieForLogOut()).toEqual(
        'string',
      );
    });
  });

  describe('register', () => {
    it('Registrando usuario', () => {
      const newUser: CreateUserDto = {
        email: 'falso@mail.com',
        name: 'Carlos',
        password: 'ddd',
      };
      expect(typeof authenticationService.register(newUser)).toEqual('object');
    });
  });
});

//describe('The UsersService', () => {
//  let usersService: UsersService;
//  let findOne: jest.Mock;
//  beforeEach(async () => {
//    findOne = jest.fn();
//    const module = await Test.createTestingModule({
//      providers: [
//        UsersService,
//        {
//          provide: getRepositoryToken(User),
//          useValue: {
//            findOne,
//          },
//        },
//      ],
//    }).compile();
//    usersService = await module.get(UsersService);
//  });
//  describe('when getting a user by email', () => {
//    describe('and the user is matched', () => {
//      let user: User;
//      beforeEach(() => {
//        user = new User();
//        findOne.mockReturnValue(Promise.resolve(user));
//      });
//      it('should return the user', async () => {
//        const fetchedUser = await usersService.getByEmail('test@test.com');
//        expect(fetchedUser).toEqual(user);
//      });
//    });
//    describe('and the user is not matched', () => {
//      beforeEach(() => {
//        findOne.mockReturnValue(undefined);
//      });
//      it('should throw an error', async () => {
//        await expect(
//          usersService.getByEmail('test@test.com'),
//        ).rejects.toThrow();
//      });
//    });
//  });
//});
