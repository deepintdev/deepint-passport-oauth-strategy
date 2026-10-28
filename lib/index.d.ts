import { Strategy as PassportStrategy } from 'passport-strategy';
import { Request } from 'express';

export interface VerifyCallback {
    (req: Request, done: VerifiedCallback): void;
}

export interface VerifiedCallback {
    (error: any, user?: any, info?: any): void;
}

export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    /** Instance URL. Defaults to `https://app.air-core.io` (use `https://app.deepint.net` for the legacy host). */
    baseURL?: string;
    /** Defaults to `<baseURL>/oauth/authorize`. */
    authorizationURL?: string;
    /** Defaults to `<baseURL>/api/oauth/login`. */
    tokenURL?: string;
    /** Defaults to `<baseURL>/api/v1/who`. */
    userInfoURL?: string;
    /** Defaults to `<baseURL>/api/v1/profile`. */
    profileURL?: string;
    [key: string]: any;
}

export declare class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions | any, verify: any);
    authenticate(req: Request, options?: any): any;
}
