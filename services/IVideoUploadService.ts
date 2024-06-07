
export interface IVideoUploadService {
    getUploadUrl(videoId: string, fileName: string, duration: number): Promise<string>;
    videoUploaded(videoId: string, videoFileId: string, fileName: string): Promise<boolean>;
}