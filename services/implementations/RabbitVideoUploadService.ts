import Connection from "rabbitmq-client";
import { InternalServerError } from "../../errors/InternalServerError";
import { ResponseDto } from "../../dtos/ResponseDto";
import { ErrorDto } from "../../dtos/ErrorDto";
import { IVideoUploadService } from "../IVideoUploadService";

export class RabbitVideoUploadService implements IVideoUploadService {
    private rabbit: Connection;

    constructor(connection: Connection) {
        this.rabbit = connection;
    }
    async videoUploaded(videoId: string, videoFileId: string, fileName: string): Promise<boolean> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const res = await rpcClient.send('check-upload-state', { videoId, videoFileId, fileName });
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response check-upload-state: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            throw new InternalServerError(500, error.message);
        }
        else {
            let uploadState = (response.data as { uploadState: boolean }).uploadState;
            return uploadState;
        }
    }

    async getUploadUrl(videoId: string, fileName: string, duration: number): Promise<string> {
        const rpcClient = this.rabbit.createRPCClient({ confirm: true })

        const blobName = `${videoId}_${fileName}`;
        const res = await rpcClient.send('get-upload-url', { blobName, duration });
        await rpcClient.close()

        if (!res || !res.body || res.contentType !== 'application/json' || !ResponseDto.isResponseDto(res.body)) {
            throw new InternalServerError(500, 'Invalid response get-upload-url: ' + res.body);
        }

        const response = res.body;
        if (response.success === false) {
            let error: ErrorDto = response.data as ErrorDto;
            throw new InternalServerError(500, error.message);
        }
        else {
            let url: string = (response.data as { url: string }).url;
            return url;
        }
    }
}
