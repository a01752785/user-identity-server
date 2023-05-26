import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import UserModel from "../modelsNoSQL/UserModel";
import db from "../models";

class AuthenticationController extends AbstractController {
    protected validateBody(): void {
        throw new Error("Method not implemented.");
    }
    // Singleton
    private static instance: AuthenticationController;
    public static getInstance(): AbstractController {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AuthenticationController("auth");
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post('/signup', this.signup.bind(this));
        this.router.post('/verify', this.verify.bind(this));
        this.router.post('/signin', this.signin.bind(this));
        this.router.get('/test', this.authMiddleware.verifyToken, this.test.bind(this))
        this.router.get('/testTokenRole', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.testTokenRole.bind(this));
    }

    private async testTokenRole(req: Request, res: Response) {
        res.status(200).send("Esto es una prueba de verificacion de token y rol");
    }

    private async test(req: Request, res: Response) {
        res.status(200).send("Esto es una prueab de verificacion");
    }

    private async signup(req: Request, res: Response) {
        const { email, password, name, role } = req.body;
        try {
            // Crear el usuario de cognito
            const user = await this.cognitoService.signUpUser(email, password,[ {
                Name: 'email',
                Value: email
            }]);
            console.log('cognito user created', user);
            // Creacion del usuario dentro de la base de datos no SQL-DynamoDB
            await UserModel.create({
                awsCognitoId: user.UserSub,
                name,
                role,
                email
            },
            {overwrite: false});
            // Creacion del usuario dentro de la RDS-MySQL
            await db['User'].create({
                awsCognitoId: user.UserSub,
                name,
                role,
                email
            });
            res.status(201).send({message: "User signedUp"})
        } catch(error) {
            res.status(500).send({code: error})
        }
    }

    private async verify(req: Request, res: Response) {
        const { email, code } = req.body;
        try {
            await this.cognitoService.verifyUser(email, code);
            return res.status(200).send({message: "Correct verification"});
        } catch (error) {
            res.status(500).send({code: error});
        }
    }

    private async signin(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const login = await this.cognitoService.signInUser(email, password);
            res.status(200).send({...login.AuthenticationResult});
        } catch (error) {
            res.status(500).send({code: error});
        }
    }
}

export default AuthenticationController;