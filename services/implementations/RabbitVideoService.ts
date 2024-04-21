import Connection from "rabbitmq-client";
import { IVideoService } from "../IVideoService";
import { Video } from "../../entities/video/Video";
import { InternalServerError } from "../../errors/InternalServerError";
import { ResponseDto } from "../../dtos/ResponseDto";
import { ErrorDto } from "../../dtos/ErrorDto";
import { InvalidInputError } from "../../errors/InvalidInputError";
import e from "express";
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

        if (!res || !res.body || res.contentType !== 'application/json') {
            throw new InternalServerError(500, 'Invalid response get-all-videos: ' + res.body);
        }

        const videos = res.body as Video[];

        if (!videos) {
            throw new InternalServerError(500, 'Parsing of videos failed');
        }
        return videos;
    }
    async getAllVisibleVideos(): Promise<Video[]> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-all-visible-videos', '');
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json') {
            throw new InternalServerError(500, 'Invalid response get-all-visible-videos: ' + res.body);
        }

        const videos = res.body as Video[];

        if (!videos) {
            throw new InternalServerError(500, 'Parsing of videos failed');
        }
        return videos;
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
    async deleteVideoByID(id: number): Promise<Boolean | string> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('delete-video', { id });
        await rpcClient.close()
        console.log('bodu', res.body);

        if (!res.body) {
            return false;
        }
        if (res.body.error) {
            if (res.body.error) {
                return res.body.error;
            }
        }

        const video = res.body as boolean;

        if (!video) {
            if (res.body.error) {
                return res.body.error;
            }
            else {
                return "Internal server error";
            }
        }
        return video;
    }
    async createVideo(title: string, description: string): Promise<Video | string> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('create-video', { title, description });
        await rpcClient.close()
        console.log(res.body);

        if (!res.body) {
            return "Internal server error";
        }

        const video = res.body as Video;

        if (!isVideo(video)) {
            if (res.body.error) {
                return res.body.error;
            }
            else {
                return "Internal server error";
            }
        }

        return video;

    }
    updateVideo({ id, title, description, videoState }: { id: number; title?: string | undefined; description?: string | undefined; videoState?: any; }): Promise<Video> {
        throw new Error("Method not implemented.");
    }
}

function isVideo(obj: any): obj is Video {
    return obj && obj.id && typeof obj.id === 'number' && obj.title && typeof obj.title === 'string' && obj.description && typeof obj.description === 'string' && obj.videoState;
}
