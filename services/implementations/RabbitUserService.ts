import Connection from "rabbitmq-client";
import { IVideoService } from "../IVideoService";
import { Video } from "../../entities/video/Video";
import { InternalServerError } from "../../errors/InternalServerError";
import { ResponseDto } from "../../dtos/ResponseDto";
import { ErrorDto } from "../../dtos/ErrorDto";
import { InvalidInputError } from "../../errors/InvalidInputError";
import { NotFoundError } from "../../errors/NotFoundError";
import { IUserService } from "../IUserService";
import { User } from "../../entities/user/User";
import { UserDto } from "../../dtos/UserDto";

export class RabbitUserService implements IUserService {
    private rabbit: Connection;

    constructor(connection: Connection) {
        this.rabbit = connection;
    }
    async authenticateUser(email: string, password: string): Promise<UserDto> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('authenticate-user', { email, password });
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response authenticate-user: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            if (error.code == 401) {
                throw new NotFoundError(401, error.message);
            }
            else if (error.code == 400) {
                throw new InvalidInputError(400, error.message);
            }
            else {
                throw new InternalServerError(500, error.message);
            }
        }
        else {
            let user: User = response.data as User;
            return UserDto.fromUser(user);
        }
    }

    async getAllUsers(): Promise<UserDto[]> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-all-users', '');
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response get-all-users: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            throw new InternalServerError(500, error.message);
        }
        else {
            let users: User[] = response.data as User[];
            let dtos = users.map(user => UserDto.fromUser(user));
            return dtos;
        }
    }
    async getUserById(id: string): Promise<UserDto> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-user-by-id', { id });
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response get-user-by-id: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            if (error.code == 404) {
                throw new NotFoundError(404, error.message);
            }
            else if (error.code == 400) {
                throw new InvalidInputError(400, error.message);
            }
            else {
                throw new InternalServerError(500, error.message);
            }
        }
        else {
            let user: User = response.data as User;
            return UserDto.fromUser(user);
        }
    }
    async deleteUserById(id: string): Promise<UserDto> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('delete-user', { id });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response delete-user: ' + res.body);
        }

        if (ResponseDto.isResponseDto(res.body)) {
            let response = res.body;
            if (response.success === false) {
                let error: ErrorDto = response.data as ErrorDto;
                if (error.code == 400) {
                    throw new InvalidInputError(400, error.message);
                }
                else if (error.code == 404) {
                    throw new NotFoundError(404, error.message);
                }
                else {
                    throw new InternalServerError(500, error.message);
                }
            }
            else {
                let user: User = response.data as User;
                return UserDto.fromUser(user);
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async createUser(email: string, password: string, displayName: string): Promise<UserDto> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('create-user', { email, password, displayName });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response create user: ' + res.body);
        }

        if (ResponseDto.isResponseDto(res.body)) {
            let response = res.body;
            if (response.success === false) {
                let error: ErrorDto = response.data as ErrorDto;
                if (error.code == 400) {
                    throw new InvalidInputError(400, error.message);
                }
                else {
                    throw new InternalServerError(500, error.message);
                }
            }
            else {
                let user = (response.data as User);
                return UserDto.fromUser(user);
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }
    async updateUser({ id, email, password, displayName }: { id: string; email?: string | undefined; password?: string | undefined; displayName?: string | undefined; }): Promise<UserDto> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('update-user', { id, email, password, displayName });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response update user: ' + res.body);
        }

        if (ResponseDto.isResponseDto(res.body)) {
            let response = res.body;
            if (response.success === false) {
                let error: ErrorDto = response.data as ErrorDto;
                if (error.code == 400) {
                    throw new InvalidInputError(400, error.message);
                }
                else if (error.code == 404) {
                    throw new NotFoundError(404, error.message);
                }
                else {
                    throw new InternalServerError(500, error.message);
                }
            }
            else {
                let user: User = response.data as User;
                return UserDto.fromUser(user);
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }
}

