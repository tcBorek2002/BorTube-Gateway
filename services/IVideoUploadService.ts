
export interface IVideoUploadService {
    getUploadUrl(videoId: string, fileName: string, duration: number): Promise<string>;
    videoUploaded(videoId: number, videoFileId: number, fileName: string): Promise<boolean>;
}