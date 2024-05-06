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

export class RabbitUserService implements IUserService {
    private rabbit: Connection;

    constructor(connection: Connection) {
        this.rabbit = connection;
    }
    async authenticateUser(email: string, password: string): Promise<User> {
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
            return user;
        }
    }

    async getAllUsers(): Promise<User[]> {
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
            return users;
        }
    }
    async getUserById(id: string): Promise<User> {
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
            return user;
        }
    }
    async deleteUserById(id: string): Promise<User> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('delete-user', { id });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response delete-user-by-id: ' + res.body);
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
                return user;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async createUser(email: string, password: string, displayName: string): Promise<User> {
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
                return user;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }
    async updateUser({ id, email, password, displayName }: { id: string; email?: string | undefined; password?: string | undefined; displayName?: string | undefined; }): Promise<User> {
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
                return user;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async getAllVideos(): Promise<Video[]> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-all-videos', '');
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response get-all-videos: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            throw new InternalServerError(500, error.message);
        }
        else {
            let videos: Video[] = response.data as Video[];
            return videos;
        }
    }

    async getAllVisibleVideos(): Promise<Video[]> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-all-visible-videos', '');
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response get-all-visible-videos: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            throw new InternalServerError(500, error.message);
        }
        else {
            let videos: Video[] = response.data as Video[];
            return videos;
        }
    }

    async getVideoById(id: string): Promise<Video> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-video-by-id', { id });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response get-video-by-id: ' + res.body);
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
                let video: Video = response.data as Video;
                return video;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }
    async deleteVideoByID(id: string): Promise<Video> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('delete-video', { id });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response delete-video-by-id: ' + res.body);
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
                let video: Video = response.data as Video;
                return video;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async createVideo(title: string, description: string, fileName: string, duration: number): Promise<{ video: Video, sasUrl: string }> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('create-video', { title, description, fileName, duration });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response create video: ' + res.body);
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
                let returnObject = (response.data as { video: Video, sasUrl: string });
                return returnObject;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async updateVideo({ id, title, description, videoState }: { id: string; title?: string | undefined; description?: string | undefined; videoState?: any; }): Promise<Video> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('update-video', { id, title, description, videoState });
        await rpcClient.close()

        if (!res.body) {
            throw new InternalServerError(500, 'Invalid response update video: ' + res.body);
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
                let video: Video = response.data as Video;
                return video;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }
}

