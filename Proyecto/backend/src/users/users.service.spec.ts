import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../core/prisma/prisma.service';
import { UtilsService } from '@app/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: Partial<PrismaService>;
  let utilsService: Partial<UtilsService>;

  beforeEach(async () => {
    prismaService = {
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as PrismaService;

    utilsService = {
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
        { provide: UtilsService, useValue: utilsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateUserDto: CreateUserDto = {
      id: 1,
      email: 'test@example.com',
      phoneNumber: '1234567890',
      name: 'Test User',
      role: UserRole.USER,
      password: 'password',
      birthDate: '2000-01-01',
    };
    it('should create a user successfully', async () => {
      const hashedPassword = 'hashed_password';
      const expectedDate = new Date('2000-01-01');

      const mockCreatedUser = {
        id: '1',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        name: 'Test User',
        role: 'USER',
        password: hashedPassword,
        birthDate: expectedDate,
      };

      (utilsService.hashPassword as jest.Mock).mockResolvedValue(
        hashedPassword,
      );
      (prismaService.user.create as jest.Mock).mockResolvedValue(
        mockCreatedUser,
      );

      const result = await service.createUser(mockCreateUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: mockCreateUserDto.id.toString(),
          email: mockCreateUserDto.email,
          phoneNumber: mockCreateUserDto.phoneNumber,
          name: mockCreateUserDto.name,
          role: mockCreateUserDto.role,
          password: hashedPassword,
          birthDate: expectedDate,
        },
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw an exception if there is an error during user creation', async () => {
      const hashedPassword = 'hashed_password';

      (utilsService.hashPassword as jest.Mock).mockResolvedValue(
        hashedPassword,
      );
      (prismaService.user.create as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        'Error creating user',
      );

      expect(utilsService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserDto.password,
      );
    });
  });

  describe('get', () => {
    it('should find a user by email successfully', async () => {
      const mockEmail = 'test@example.com';
      const mockUser = {
        id: '1',
        email: mockEmail,
        phoneNumber: '1234567890',
        name: 'Test User',
        role: 'USER',
        password: 'hashed_password',
        birthDate: new Date('2000-01-01'),
      };

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOneByemail(mockEmail);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockEmail,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user with email does not exist', async () => {
      const mockEmail = 'nonexistent@example.com';

      (prismaService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneByemail(mockEmail);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockEmail,
        },
      });
      expect(result).toBeNull();
    });

    it('should throw an exception if there is an error finding user by email', async () => {
      const mockEmail = 'test@example.com';

      (prismaService.user.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOneByemail(mockEmail)).rejects.toThrow(
        'Error finding user',
      );

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockEmail,
        },
      });
    });
  });
});
