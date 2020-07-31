import { Logger } from './utils';
import { ConfigurationService } from './configuration-service';
import { IResizeOption } from './models';

const logger = new Logger('ImageProcessor');
const appConfig = ConfigurationService.getAppConfig();
const sharp = require('sharp');

export class ImageProcessor {

  static buildPath (imagePath:string, suffix:string) {

    // TODO: reuse FilePathsService here
    const pos = imagePath.lastIndexOf('.');
    return imagePath.substr(0, pos < 0 ? imagePath.length : pos) + suffix;
  }

  static async convertToJpeg (imagePath:string, quality:number) {

    const jpegPath = ImageProcessor.buildPath(imagePath, '_.jpg');

    await sharp( imagePath )
      .jpeg( {quality} )
      .toFile( jpegPath );

    return jpegPath;
  }

  static async resize ( imagePath:string, resizeImageSuffix:string, resizeOpts: IResizeOption) {

    const resizeImagePath = ImageProcessor.buildPath( imagePath, resizeImageSuffix);

    await sharp( imagePath )
      .resize( resizeOpts.width, resizeOpts.height, appConfig.resizeConfig)
      .jpeg( {quality: resizeOpts.quality} ) ///???
      .toFile( resizeImagePath );

    return resizeImagePath;
  }

  async resizeReference (imagePath:string) {

    logger.log('resizeReference', imagePath);

    const results = await Promise.all([

      await ImageProcessor.resize(imagePath, '_sm.jpg', appConfig.resizeOpts.sm),
      await ImageProcessor.resize(imagePath, '_md.jpg', appConfig.resizeOpts.md),
      await ImageProcessor.resize(imagePath, '_lg.jpg', appConfig.resizeOpts.lg),
      // await ImageProcessor.convertToJpeg(imagePath, 97)
    ]);

    return {
      sm: results[0],
      md: results[1],
      lg: results[2],
      // full_jpeg: results[3]
    }
  }

  async resizeTestResult (imagePath:string) {

    logger.log('resizeTestResult', imagePath);

    if (!imagePath) {
      return imagePath;
    }

    // await ImageProcessor.convertToJpeg(imagePath, 97)
    const resizeOpt:IResizeOption = {
      width: 660,
      quality: 97
    };

    return await ImageProcessor.resize(imagePath, '_660.jpg', resizeOpt);
  }
}

