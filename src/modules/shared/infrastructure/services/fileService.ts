import File from "../../../logbook/entities/file";
import { Visibility } from "../../../logbook/entities/logbook";
import AppError from "../../AppError";

export interface FileService {
  uploadFile: (
    file: any,
    userId: string,
    visibility: Visibility
  ) => Promise<string | void>;
  deleteFile: (file: File) => void;
  downloadFile: (file: File) => Promise<string>;
}

export class FileServiceImpl implements FileService {
  bucketClient: any;

  constructor(
    private BucketClient: any,
    private UploadObjectCommand: any,
    private DeleteObjectCommand: any,
    private GetObjectCommand: any,
    private getSignedUrl: any,
    private NodeHttpHandler: any
  ) {
    this.bucketClient = new this.BucketClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: <string>process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(
    file: any,
    userId: string,
    visibility: Visibility
  ): Promise<string | void> {
    if (file.size > 5000000)
      throw AppError.badRequestError(
        "File size limit exceeded, file must be 5mb or less"
      );

    try {
      const command = new this.UploadObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${file.originalname}`,
        Body: file.buffer,
      });

      await this.bucketClient.send(command);
      if (visibility === Visibility.public) {
        return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/public/${userId}/${file.originalname}`;
      }
    } catch (error: any) {
      throw AppError.internalServerError("Error uploading file", error);
    }
  }

  async deleteFile({ visibility, userId, name }: File) {
    try {
      const command = new this.DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${name}`,
      });

      await this.bucketClient.send(command);
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting file", error);
    }
  }

  async downloadFile({ visibility, userId, name }: File): Promise<string> {
    try {
      const command = new this.GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${visibility}/${userId}/${name}`,
      });

      const presignedUrl = await this.getSignedUrl(this.bucketClient, command, {
        expiresIn: 3600,
        requestHandler: new this.NodeHttpHandler(),
      });

      return presignedUrl;
    } catch (error: any) {
      throw AppError.internalServerError("Error getting file", error);
    }
  }
}
