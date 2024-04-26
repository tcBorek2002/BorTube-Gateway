
export interface IVideoUploadService {
    getUploadUrl(videoId: string, fileName: string, duration: number): Promise<string>;
}