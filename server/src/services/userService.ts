import { pool } from "../config/database";
import { SignupData, SigninData, User, AuthResponse } from "../types/authTypes";
import bcrypt from 'bcryptjs';

export const userService = {
    async createUser(userdata : SignupData): Promise<Omit<User, 'password_hash'>> {
        const {email, username, password} = userdata;

        const exists = await this.findByEmail(email);
        if(exists) {
            throw new Error('An account with this email already exists.')
        }

        const hashed_password = await bcrypt.hash(password, 12);

        const result = await pool.query(`
            INSERT INTO users (email, username, password_hash) VALUES
            ($1, $2, $3) RETURNING id, email, username, balance
        `, [email, username, hashed_password])

        return result.rows[0]
    },

    async findByEmail(email : string): Promise<User | null> {
        const result = await pool.query(`
            SELECT * FROM users WHERE email = $1     
        `, [email])

        return result.rows[0] || null
    },

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    async authenticateUser(email: string, password: string): Promise<Omit<User, 'password_hash'>
    | null> {
        const user = await this.findByEmail(email);
        if (!user) {
        return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
        return null;
        }
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}