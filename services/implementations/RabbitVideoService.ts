import Connection from "rabbitmq-client";
import { IVideoService } from "../IVideoService";
import { Video } from "../../entities/video/Video";
import { InternalServerError } from "../../errors/InternalServerError";
import { ResponseDto } from "../../dtos/ResponseDto";
import { ErrorDto } from "../../dtos/ErrorDto";
import { InvalidInputError } from "../../errors/InvalidInputError";
import { NotFoundError } from "../../errors/NotFoundError";

export class RabbitVideoService implements IVideoService {
    private rabbit: Connection;

    constructor(connection: Connection) {
        this.rabbit = connection;
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

    async getVideoById(id: number): Promise<Video> {
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
    async deleteVideoByID(id: number): Promise<Video> {
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

    async createVideo(title: string, description: string): Promise<Video> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('create-video', { title, description });
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
                let video: Video = response.data as Video;
                return video;
            }
        }
        else {
            throw new InternalServerError(500, 'Parsing of message failed');
        }
    }

    async updateVideo({ id, title, description, videoState }: { id: number; title?: string | undefined; description?: string | undefined; videoState?: any; }): Promise<Video> {
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

function isVideo(obj: any): obj is Video {
    return obj && obj.id && typeof obj.id === 'number' && obj.title && typeof obj.title === 'string' && obj.description && typeof obj.description === 'string' && obj.videoState;
}
