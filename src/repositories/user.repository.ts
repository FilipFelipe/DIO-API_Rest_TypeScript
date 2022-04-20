import db from '../db';
import DatabaseError from '../models/errors/database.error.model';
import User from '../models/user.model';

const secret = process.env.SECRET || '86ee2b27-e549-423e-8d03-5b378eaa9f69'
class UserRepository {

    async findAllUsers(): Promise<User[]> {
        const query = `
        SELECT uuid, username
        FROM application_user;
        `;
        const { rows } = await db.query<User>(query)
        return rows || [];
    }

    async findByUUID(uuid: string): Promise<User> {
        try {
            const query = `
        SELECT uuid, username
        FROM application_user
        WHERE uuid = $1;
        `;
            const values = [uuid];
            const { rows } = await db.query<User>(query, values);
            const [user] = rows
            return user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta',error)
        }
       
    }

    async create(user: User): Promise<string> {
        const query = `
        INSERT INTO application_user (
            username, 
            password
        )
        VALUES ($1, crypt($2, '${secret}'))
        RETURNING uuid;
        `;
        const values = [user.username, user.password];
        const { rows } = await db.query<{ uuid: string }>(query, values);
        const [newUser] = rows
        return newUser.uuid;
    }

    async update(user: User): Promise<string> {
        const query = `
        UPDATE application_user SET 
        username=$1, 
        password=crypt($2, '${secret}')
        WHERE uuid = $3
        RETURNING uuid;
        `;
        const values = [user.username, user.password, user.uuid];
        const { rows } = await db.query<{ uuid: string }>(query, values);
        const [newUser] = rows
        return newUser.uuid;
    }

    async remove(uuid: string): Promise<void> {
        const query = `
        DELETE 
        FROM application_user 
        WHERE uuid=$1;
        `;
        const values = [uuid];
        await db.query(query, values);
        return ;
    }

}

export default new UserRepository();