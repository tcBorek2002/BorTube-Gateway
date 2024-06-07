import { ResponseDto } from "../dtos/ResponseDto";
import { Video } from "../entities/video/Video";
import { VideoDto } from "../entities/video/VideoDto";
import { VideoState } from "../entities/video/VideoState";

export interface IVideoService {
    getAllVideos(): Promise<VideoDto[]>;
    getAllVisibleVideos(): Promise<VideoDto[]>;
    getVideoById(id: string): Promise<VideoDto>;
    deleteVideoByID(id: string): Promise<VideoDto>;
    createVideo(userId: string, title: string, description: string, fileName: string, duration: number): Promise<{ video: VideoDto, sasUrl: string }>;
    updateVideo({ id, title, description, videoState }: { id: string; title?: string; description?: string; videoState?: VideoState }): Promise<VideoDto>;
}