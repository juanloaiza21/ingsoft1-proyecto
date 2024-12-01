import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    phoneNumber?: string;
    
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
    
    @IsString()
    @IsOptional()
    password?: string;
    
    @IsDate()
    @IsOptional()
    birthDate?: Date;
}
