
export interface IVideoUploadService {
    getUploadUrl(videoId: string, fileName: string): Promise<string>;
}