const sharp = require('sharp');

const resizeConfig = {
  fit: 'cover',
  position: 'right top',
  withoutEnlargement: true,
  sizes: {
    sm: { quality: 80, width: 185, height: 150 },
    md: { quality: 90, width: 420, height: 300 },
    lg: { quality: 90, width: 570 },
  }
};


class ImageProcessor {

  static buildPath (imagePath, suffix) {

    // TODO: reuse FilePathsService here
    const pos = imagePath.lastIndexOf('.');
    return imagePath.substr(0, pos < 0 ? imagePath.length : pos) + suffix;
  }

  static async convertToJpeg (imagePath, quality) {

    const jpegPath = ImageProcessor.buildPath(imagePath, '_.jpg');

    await sharp( imagePath )
      .jpeg( {quality: quality} )
      .toFile( jpegPath );

    return jpegPath;
  }

  static async resize ( imagePath, resizeImageSuffix, width, height, quality) {

    const resizeImagePath = ImageProcessor.buildPath( imagePath, resizeImageSuffix);

    await sharp( imagePath )
      .resize( width, height, resizeConfig)
      .jpeg( {quality: quality} )
      .toFile( resizeImagePath );

    return resizeImagePath;
  }

  async resizeReference (imagePath) {

    console.log('[ImageProcessor] resizeReference', imagePath);

    const results = await Promise.all([

      await ImageProcessor.resize(imagePath, '_sm.jpg', resizeConfig.sizes.sm.width, resizeConfig.sizes.sm.height, resizeConfig.sizes.sm.quality),
      await ImageProcessor.resize(imagePath, '_md.jpg', resizeConfig.sizes.md.width, resizeConfig.sizes.md.height, resizeConfig.sizes.md.quality),
      await ImageProcessor.resize(imagePath, '_lg.jpg', resizeConfig.sizes.lg.width, resizeConfig.sizes.lg.height, resizeConfig.sizes.lg.quality),
      // await ImageProcessor.convertToJpeg(imagePath, 97)
    ]);

    return {
      sm: results[0],
      md: results[1],
      lg: results[2],
      // full_jpeg: results[3]
    }
  }

  async resizeTestResult (imagePath) {

    console.log('[ImageProcessor] resizeTestResult', imagePath);

    if (!imagePath) {
      return imagePath;
    }

    // await ImageProcessor.convertToJpeg(imagePath, 97)
    return await ImageProcessor.resize(imagePath, '_660.jpg', 660, undefined, 97);
  }
}


const imageProcessor = new ImageProcessor();


module.exports = {

  resizeReference: imageProcessor.resizeReference,
  resizeTestResult: imageProcessor.resizeTestResult
}
