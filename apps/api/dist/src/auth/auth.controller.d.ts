import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        data: {
            access_token: string;
            user: {
                id: string;
                first_name: string;
                last_name: string;
                email: string;
            };
        };
        meta: {};
        errors: never[];
    }>;
}
