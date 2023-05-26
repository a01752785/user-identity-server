import {Request, Response} from "express";
import AbstractController from "./AbstractController";

class UserController extends AbstractController {
    protected validateBody(): void {
        throw new Error("Method not implemented.");
    }
    // Singleton
    private static instance: UserController;
    public static getInstance(): AbstractController {
        if (!this.instance) {
            this.instance = new UserController('user');
        }
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.get("/readUsers", this.getReadUsers.bind(this));
        this.router.post("/createUser", this.getCreateUser.bind(this));
    }

    private getReadUsers(req: Request, res: Response) {
        res.status(200).send("Servicio en línea");
    }

    private getCreateUser(req: Request, res: Response) {
        res.status(200).send("Registro exitoso");
    }
}

export default UserController;