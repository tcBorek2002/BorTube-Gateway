import express, { Router, Request, Response } from 'express'
import { InternalServerError } from '../errors/InternalServerError';
import { InvalidInputError } from '../errors/InvalidInputError';
import { NotFoundError } from '../errors/NotFoundError';
import { IUserService } from '../services/IUserService';
import passport from 'passport';
import { UserDto } from '../dtos/UserDto';

export class UserRouter {
    private usersRouter: Router;
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.usersRouter = express.Router();
        this.userService = userService;

        // add prefix to all routes
        this.usersRouter.post('/login', passport.authenticate('local'), this.login);
        this.usersRouter.post('/logout', this.logout);
        this.usersRouter.get('/users/:id', this.getUserById);
        this.usersRouter.put('/users/:id', this.updateUser);
        this.usersRouter.post('/users', this.createUser);
        this.usersRouter.delete('/users/:id', this.deleteUser);
    }

    private login = (req: Request, res: Response) => {
        //  #swagger.description = 'Login a user'
        //  #swagger.parameters['body'] = {
        //   in: 'body',
        //   required: true,
        //   type: 'object',
        //   schema: 
        //    {username: '
        //      type: 'string',
        //      required: true,
        //      description: 'The email of the user'
        //    },
        //    {password: '
        //      type: 'string',
        //      required: true,
        //      description: 'The password of the user'
        //    }
        // }
        res.status(200).json({ message: 'Login successful', userId: req.user?.id });
    }

    private logout = (req: Request, res: Response) => {
        //  #swagger.description = 'Logout a user'
        console.log('Logging out user:', req.user);
        req.logout((err: any) => {
            if (err) {
                console.error('Error logging out user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'Logout successful' });
            }
        });
    }

    private getUserById = (req: Request, res: Response) => {
        //  #swagger.description = 'Get a user by its ID'
        const userId = req.params.id;

        // Check if the video ID is a valid number
        if (userId == null) {
            res.status(400).send('User ID is required.');
            return;
        }

        this.userService.getUserById(userId).then((user) => {
            if (!user) {
                res.status(500).send("Internal server error.");
            }
            else {
                res.send(user);
            }
        }).catch((error) => {
            console.error('Error getting user by ID:', error);
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: 'Invalid user ID' });
            }
            else if (error instanceof NotFoundError) {
                res.status(404).json({ error: 'User not found' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private updateUser = (req: Request, res: Response) => {
        //  #swagger.description = 'Update a user by its ID'
        const userId = req.params.id;

        // Check if the video ID is a valid number
        if (userId == null) {
            res.status(400).send('User ID is required.');
            return;
        }
        const { email, password, displayName } = req.body;

        // Update the video in the database
        this.userService.updateUser({ id: userId, email: email, password: password, displayName: displayName }).then((updatedUser) => {
            if (updatedUser != null) { res.status(200).json(updatedUser) }
            else {
                res.status(404).send("User not found");
            }
        }).catch((error) => {
            console.error('Error updating user:', error);
            if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: error.message });
            }
            else if (error instanceof NotFoundError) {
                return res.status(404).json({ error: 'User not found' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private createUser = (req: Request, res: Response) => {
        //  #swagger.description = 'Create a new user'
        if (req.body == null) { return res.status(400).json({ error: 'Email, password and displayName are required' }); }

        const { email, password, displayName } = req.body;
        if (email == undefined || password == undefined || displayName == undefined) {
            res.status(400).json({ error: 'Email, password and displayName are required' });
            return;
        }

        this.userService.createUser(email, password, displayName).then((returnObj) => {
            return res.status(201).json(returnObj);
        }).catch((error) => {
            console.error('Error creating user:', error);
            if (error instanceof InternalServerError) {
                return res.status(500).json({ error: error.message });
            }
            else if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: 'Invalid input: email, password and displayName are required.' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    private deleteUser = (req: Request, res: Response) => {
        //  #swagger.description = 'Delete a user by its ID'
        const userId = req.params.id;

        // Check if the video ID is a valid number
        if (userId == null) {
            res.status(400).send('User ID is required.');
            return;
        }

        this.userService.deleteUserById(userId).then((deleted) => {
            return res.status(204).send();
        }).catch((error) => {
            console.error('Error deleting user:', error);
            if (error instanceof InvalidInputError) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            else if (error instanceof NotFoundError) {
                return res.status(404).json({ error: 'User not found' });
            }
            else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }

    public getRouter(): Router {
        return this.usersRouter;
    }
}