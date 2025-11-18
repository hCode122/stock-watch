import { pool } from "../config/database";
import { SignupData, SigninData, User } from "../types/authTypes";
import bcrypt from 'bcryptjs';

export const userService = {
    async createUser(userdata : SignupData): Promise<Omit<User, 'password_hash'>> {
        const {email, firstname, lastname, password} = userdata;

        const exists = await this.findByEmail(email);
        if(exists) {
            throw new Error('An account with this email already exists.')
        }

        const hashed_password = await bcrypt.hash(password, 12);

        const result = await pool.query(`
            INSERT INTO users (email, firstname, lastname, password) VALUES
            ($1, $2, $3, $4) RETURNING id, email, firstname, lastname, created_at
        `, [email, firstname, lastname, hashed_password])

        return result.rows[0]
    },

    async findByEmail(email : string): Promise<SignupData | null> {
        const result = await pool.query(`
            SELECT * FROM users WHERE email = $1     
        `, [email])

        return result.rows[0] || null
    },

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}