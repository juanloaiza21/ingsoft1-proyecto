import { BadRequestException, Injectable ,UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
// import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService:JwtService,
        private readonly usersService: UsersService){}

    
    async register(register:RegisterDto){

        //se revisa que no haya un usuario registrado con el email o el teléfono
        const userEmail = await this.usersService.findOneByemail(register.email );
        const userPhoneNumber = await this.usersService.findOneByphoneNumber(register.phoneNumber );
        
        if (userEmail || userPhoneNumber){
            throw new BadRequestException('User already exists');
        }

        //si no existe el usuario, se hashea el password para luego crearlo en la db
        const hashedPassword = await bcryptjs.hash(register.password, 10); 
        const userHashed = {
            ...register,
            password: hashedPassword,  
        };

        //se crea el usuario
        return await this.usersService.createUser(userHashed);
    }

    async login( loginDto:LoginDto ){
        
        const user = await this.usersService.findOneByemail(loginDto.email);

        if (!user){

            throw new UnauthorizedException('Email is wrong');
        }

        const isPasswordValid = await bcryptjs.compare(loginDto.password,(await user).password);
        
        if (!isPasswordValid){
            throw new UnauthorizedException('Wrong password');
        }
        
        const email_ = user.email 
        const payload = {email: email_};
        const token = await this.jwtService.signAsync(payload);
        
        return {
            token,
            email_,
        };
    }

}
