import { ResponseDto } from "../dtos/ResponseDto";
import { UserDto } from "../dtos/UserDto";
import { User } from "../entities/user/User";
import { Video } from "../entities/video/Video";
import { VideoState } from "../entities/video/VideoState";

export interface IUserService {
    authenticateUser(email: string, password: string): Promise<UserDto>;
    getAllUsers(): Promise<UserDto[]>;
    getUserById(id: string): Promise<UserDto>;
    deleteUserById(id: string): Promise<UserDto>;
    createUser(email: string, password: string, displayName: string): Promise<UserDto>;
    updateUser({ id, email, password, displayName }: { id: string; email?: string; password?: string; displayName?: string }): Promise<UserDto>;
    deleteUserById(id: string): Promise<UserDto>;
}