import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
export declare class UsersService {
    private readonly db;
    constructor(db: NodePgDatabase<typeof schema>);
    findByEmail(email: string): Promise<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        password_hash: string;
        is_active: boolean;
        created_at: Date;
    } | undefined>;
    findById(id: string): Promise<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        password_hash: string;
        is_active: boolean;
        created_at: Date;
    } | undefined>;
    getUserPermissions(userId: string): Promise<{
        action: string;
        resource: string;
        scope: string;
    }[]>;
}
