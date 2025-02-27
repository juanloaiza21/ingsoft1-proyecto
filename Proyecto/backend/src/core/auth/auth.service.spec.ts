import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@app/utils';
import { Payload } from './types/payload.types';
import { Role } from './enums/role.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let utilsService: jest.Mocked<UtilsService>;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByemail: jest.fn(),
      updateUserById: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const mockPayload: Payload = {
      email: 'test@test.com',
      sub: '123',
      role: Role.ADMIN,
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockUtilsService = {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    utilsService = module.get(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Generate token', () => {
    it('should return access_token and refresh_token', async () => {
      const mockPayload: Payload = {
        email: 'test@test.com',
        sub: '123',
        role: Role.ADMIN,
      };

      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_SECRET_REFRESH') return 'test-refresh-secret';
        return null;
      });

      jwtService.signAsync.mockResolvedValueOnce('mock-access-token');
      jwtService.signAsync.mockResolvedValueOnce('mock-refresh-token');

      const result = await (service as any).generateToken(mockPayload);

      expect(result).toEqual({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, mockPayload, {
        secret: 'test-secret',
        expiresIn: '15m',
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, mockPayload, {
        secret: 'test-refresh-secret',
        expiresIn: '7d',
      });
    });
  });

  describe('update token', () => {
    it('should update refresh token hash', async () => {
      const mockPayload: Payload = {
        email: 'test@test.com',
        sub: '123',
        role: Role.ADMIN,
      };
      const mockRefreshToken = 'mock-refresh-token';
      utilsService.hashPassword.mockResolvedValue('hashed-refresh-token');
      usersService.updateUserById.mockResolvedValue(undefined);

      await (service as any).updateRtHash(mockRefreshToken, mockPayload);

      expect(utilsService.hashPassword).toHaveBeenCalledWith(mockRefreshToken);
      expect(usersService.updateUserById).toHaveBeenCalledWith('123', {
        refreshToken: 'hashed-refresh-token',
      });
    });

    describe('refreshTokens', () => {
      it('should refresh tokens successfully', async () => {
        const mockRefreshToken = 'valid-refresh-token';
        const mockPayload: Payload = {
          email: 'test@test.com',
          sub: '123',
          role: Role.ADMIN,
        };
        const mockUser = {
          email: 'test@test.com',
          id: '123',
          role: Role.ADMIN,
          refreshToken: 'hashed-refresh-token',
          name: 'Test User',
          phoneNumber: '1234567890',
          password: 'hashedpassword',
          birthDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const mockTokens = {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        };

        jwtService.verifyAsync.mockResolvedValueOnce(mockPayload);
        usersService.findOneByemail.mockResolvedValueOnce(mockUser);
        utilsService.comparePassword.mockResolvedValueOnce(true);

        configService.get.mockReturnValue('test-secret');
        jwtService.signAsync.mockResolvedValueOnce('new-access-token');
        jwtService.signAsync.mockResolvedValueOnce('new-refresh-token');
        utilsService.hashPassword.mockResolvedValue('new-hashed-token');
        usersService.updateUserById.mockResolvedValue(undefined);

        const result = await service.refreshTokens(mockRefreshToken);

        expect(result).toEqual({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        });
        expect(jwtService.verifyAsync).toHaveBeenCalled();
        expect(usersService.findOneByemail).toHaveBeenCalledWith(
          mockPayload.email,
        );
        expect(utilsService.comparePassword).toHaveBeenCalledWith(
          mockRefreshToken,
          mockUser.refreshToken,
        );
      });

      it('should throw UnauthorizedException when token verification fails', async () => {
        jwtService.verifyAsync.mockRejectedValueOnce(new Error());
        await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });
  });
});
