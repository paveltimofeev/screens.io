import { IStorageService } from "../../domain/task-processor";
import { ILogger } from '../../domain/models';
const path = require('path');
const fs = require('fs');

const { promisify } = require('util');
const fileExists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const deleteFile = promisify(fs.unlink);

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


export class StorageService implements IStorageService {

    constructor (
        private readonly _bucketName: string,
        private readonly _logger: ILogger
        ) {}

    async get(fileUris: string[], targetFolder: string): Promise<string[]> {

        let downloadedFiles: string[] = [];

        for (let i = 0; i < fileUris.length; i++) {

            const file = fileUris[i]
            const filePath = path.dirname( file )
            const fileName = path.basename( file )
            const targetFile = path.join( targetFolder, fileName )

            const downloadParams = {
                Bucket: path.normalize( path.join(this._bucketName, filePath) ).replace(/\\/gi, '/'),
                Key: fileName
            };

            this._logger.log(`download file from Bucket=${downloadParams.Bucket} Key=${downloadParams.Key}`)

            let data;
            try {
                data = await s3.getObject(downloadParams).promise()
            }
            catch (err) {

                this._logger.error(`cannot download Bucket=${downloadParams.Bucket} Key=${downloadParams.Key}`, err)
                return;
            }

            this._logger.log(`write file to`, targetFile)
            await mkdir( path.dirname(targetFile), {recursive:true} )
            await writeFile( targetFile, data.Body )

            downloadedFiles.push( targetFile )
            this._logger.log(`downloaded`)
        }

        return downloadedFiles;
    }

    async save(files: string[], fromFolder: string): Promise<boolean> {

        for (let i = 0; i < files.length; i++) {

            const file = files[i]
            this._logger.log(`upload "${file}" from folder "${fromFolder}" to`, this._bucketName);
            const filePath = path.dirname( file )
            const fileName = path.basename( file )

            const exist = await fileExists(file);
            if (!exist) {
              console.log('upload: file not exists.', file);
              return null;
            }

            const fileStream = fs.createReadStream(file);
            fileStream.on('error', (err:any) => {
                this._logger.error(`Cannot read file "${file}"`, err);
            });

            const tenant = '';
            const user = '';

            const uploadParams = {
                Bucket: this._bucketName + '/' + tenant + user + path.relative(fromFolder, filePath).replace(/\\/gi, '/'),
                Key: fileName,
                Body: fileStream,
                ACL: 'public-read',
                // Expires: // The date and time at which the object is no longer cacheable.
                // For more information, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
              };

            this._logger.log(`uploading to Bucket= ${uploadParams.Bucket} Key= ${uploadParams.Key}`)
            await s3.upload( uploadParams ).promise();

            this._logger.log(`deleting local file "${file}"`)
            await deleteFile(file)

            this._logger.log(`uploaded`)
        }

        return true;
    }
}
