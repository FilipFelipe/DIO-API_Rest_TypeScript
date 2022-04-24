import { Router, Request, Response, NextFunction } from "express";
import ForbiddenError from "../errors/forbidden.error.model";
import userRepository from "../repositories/user.repository";
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from "../middlewares/basic-authentication.middleware";
import jwtAuthenticationMiddleware from "../middlewares/jwt-authentication.middleware";
import { StatusCodes } from "http-status-codes";
const secret = process.env.JWTSECRET || '86ee2b27'

const authorization = Router();


authorization.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ForbiddenError('Usuário inválido');
        }

        const jwtPayload = { username: user.username };
        const jwtOptions = { subject: user?.uuid };
        const secretKey = secret
        const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

        res.send(jwt);
    } catch (error) {
        next(error)
    }

})

authorization.post('/token/validate',jwtAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK)
})

export default authorization;