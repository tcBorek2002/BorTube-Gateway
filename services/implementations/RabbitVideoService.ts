import Connection from "rabbitmq-client";
import { IVideoService } from "../IVideoService";
import { Video } from "../../entities/video/Video";

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
            throw new Error('Invalid response get-all-videos: ' + res.body);
        }

        const videos = res.body as Video[];

        if (!videos) {
            throw new Error('Parsing of videos failed');
        }
        return videos;
    }
    async getAllVisibleVideos(): Promise<Video[]> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-all-visible-videos', '');
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json') {
            throw new Error('Invalid response get-all-videos: ' + res.body);
        }

        const videos = res.body as Video[];

        if (!videos) {
            throw new Error('Parsing of videos failed');
        }
        return videos;
    }

    async getVideoById(id: number): Promise<Video | null> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('get-video-by-id', id);
        await rpcClient.close()
        console.log(res.body);

        if (!res.body) {
            return null;
        }

        const video = res.body as Video;

        if (!video) {
            return null;
        }
        return video;
    }
    deleteVideoByID(id: number): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
    createVideo(title: string, description: string): Promise<Video> {
        throw new Error("Method not implemented.");
    }
    updateVideo({ id, title, description, videoState }: { id: number; title?: string | undefined; description?: string | undefined; videoState?: any; }): Promise<Video> {
        throw new Error("Method not implemented.");
    }
}

