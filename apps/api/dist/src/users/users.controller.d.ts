import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        data: {
            profile: {
                id: string | undefined;
                first_name: string | undefined;
                last_name: string | undefined;
                email: string | undefined;
                is_active: boolean | undefined;
            };
            permissions: {
                action: string;
                resource: string;
                scope: string;
            }[];
        };
        meta: {};
        errors: never[];
    }>;
}
