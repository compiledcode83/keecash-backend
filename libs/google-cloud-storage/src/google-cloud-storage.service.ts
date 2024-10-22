import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { StorageFile } from './storage-file';

@Injectable()
export class GoogleCloudStorageService {
  private storage: Storage;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('storageConfig.projectId'),
      credentials: {
        client_email: configService.get('storageConfig.clientEmail'),
        private_key: configService.get('storageConfig.privateKey'),
      },
    });
    this.bucket = configService.get('storageConfig.storageMediaBucket');
  }

  async delete(path: string) {
    await this.storage.bucket(this.bucket).file(path).delete({ ignoreNotFound: true });
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();

    return storageFile;
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.storage.bucket(this.bucket).file(path).getMetadata();
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(Object.entries(metadata || {}));
    storageFile.contentType = storageFile.metadata.get('contentType');

    return storageFile;
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    stream.on('finish', async () => {
      return await file.setMetadata({
        metadata: object,
      });
    });
    stream.end(media);
  }
}
