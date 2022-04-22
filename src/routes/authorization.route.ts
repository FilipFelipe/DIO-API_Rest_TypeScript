import { Router, Request, Response, NextFunction } from "express";
import ForbiddenError from "../models/errors/forbidden.error.model";

const authorization = Router();

authorization.post('/token', (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais não informadas')
        }
        const [authenticationTypen, token] = authorizationHeader.split(' ');
        if (authenticationTypen !== 'Basic' || !token) {
            throw new ForbiddenError('Tipo de authentication inválido')
        }
        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = tokenContent.split(':');

        if(!username || !password){
            throw new ForbiddenError('Credenciais não preenchidas');
        }
        res.send({username, password});
        
    } catch (error) {
        next(error)
    }

})
export default authorization;