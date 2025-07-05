import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_TOKEN_SECRET_KEY,
  expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRESIN ?? '3600',10),//1 hour & base10
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}));