import { Strategy as PassportStrategy } from 'passport-strategy';
import { Request } from 'express';

export interface VerifyCallback {
    (req: Request, done: VerifiedCallback): void;
}

export interface VerifiedCallback {
    (error: any, user?: any, info?: any): void;
}

export declare class Strategy extends PassportStrategy {
    constructor(options: any,verify: any);
    authenticate(req: Request, options?: any): any;
}
