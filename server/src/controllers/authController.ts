import { signupSchema } from "../validation/authSchema"
import { Request, Response } from 'express';
import { SignupData, AuthResponse } from '../types/authTypes';
import { userService } from "../services/userService";
import { generateToken } from "../utils/jwt";

const signup = async ( req: Request<{}, {}, SignupData>,
  res: Response<AuthResponse>) => {
    try {
        console.log(req.body)
         const { error, value } = signupSchema.validate(req.body);
        if (error) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: error.details.map(detail => ({
                field: (detail.path[0] as string),
                message: detail.message
            }))
        });
        }

    const user = await userService.createUser(value);

    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // 4. Return response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user, token }
    });

  } catch (error) {
     console.error('🔥 SIGNUP ERROR DETAILS:');
    console.error('Error message:', error instanceof Error ? error.message : error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
    console.error('Request body:', req.body);
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during signup'
    });
  }
};


const signin = async () => {
    
}

export {signup, signin};