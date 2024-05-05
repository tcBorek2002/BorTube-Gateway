import { VideoState } from "./VideoState";

export type Video = {
    id: string;
    title: string;
    description: string;
    videoState: VideoState;
    videoFileId: string | null;
}