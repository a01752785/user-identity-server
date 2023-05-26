import {Router} from 'express';
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

// Middlewares
import ValidationErrorMiddleware from '../middlewares/validationError';
import AuthMiddleware from '../middlewares/authorization';
import PermissionMiddleware from '../middlewares/permission';

// Services
import CognitoService from '../services/congnitoService';

export default abstract class AbstractController {
    private _router: Router = Router();
    private _prefix: string;

    protected handleErrors = ValidationErrorMiddleware.handleErrors;
    protected authMiddleware = AuthMiddleware.getInstance();
    protected permissionMiddleware = PermissionMiddleware.getInstance();
    protected cognitoService = CognitoService.getInstance();

    public get router(): Router {
        return this._router;
    }

    public get prefix(): string {
        return this._prefix;
    }

    protected constructor(prefix: string) {
        this._prefix = prefix;
        this.initRoutes();
    }

    protected abstract initRoutes(): void;
    protected abstract validateBody(): void;
};