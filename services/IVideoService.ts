import { ResponseDto } from "../dtos/ResponseDto";
import { Video } from "../entities/video/Video";
import { VideoState } from "../entities/video/VideoState";

export interface IVideoService {
    getAllVideos(): Promise<Video[]>;
    getAllVisibleVideos(): Promise<Video[]>;
    getVideoById(id: string): Promise<Video>;
    deleteVideoByID(id: string): Promise<Video>;
    createVideo(title: string, description: string, fileName: string, duration: number): Promise<{ video: Video, sasUrl: string }>;
    updateVideo({ id, title, description, videoState }: { id: string; title?: string; description?: string; videoState?: VideoState }): Promise<Video>;
}