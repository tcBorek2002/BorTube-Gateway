import { ResponseDto } from "../dtos/ResponseDto";
import { Video } from "../entities/video/Video";

export interface IVideoService {
    getAllVideos(): Promise<Video[]>;
    getAllVisibleVideos(): Promise<Video[]>;
    getVideoById(id: number): Promise<Video>;
    deleteVideoByID(id: number): Promise<Boolean | string>;
    createVideo(title: string, description: string): Promise<Video | string>;
    updateVideo({ id, title, description, videoState }: { id: number; title?: string; description?: string; videoState?: VideoState }): Promise<Video>;
}