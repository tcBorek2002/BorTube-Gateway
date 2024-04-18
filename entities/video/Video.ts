export type Video = {
    id: number;
    title: string;
    description: string;
    videoState: VideoState;
    videoFileId: number | null;
}