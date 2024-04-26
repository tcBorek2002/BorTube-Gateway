import { ResponseDto } from "../dtos/ResponseDto";
import { Video } from "../entities/video/Video";

export interface IVideoService {
    getAllVideos(): Promise<Video[]>;
    getAllVisibleVideos(): Promise<Video[]>;
    getVideoById(id: number): Promise<Video>;
    deleteVideoByID(id: number): Promise<Video>;
    createVideo(title: string, description: string, fileName: string, duration: number): Promise<{ video: Video, sasUrl: string }>;
    updateVideo({ id, title, description, videoState }: { id: number; title?: string; description?: string; videoState?: VideoState }): Promise<Video>;
}