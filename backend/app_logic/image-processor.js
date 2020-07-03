const sharp = require('sharp');


class ImageProcessor {

  static buildPath (imagePath, suffix) {

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
      .resize( width, height, {position: 'right top'} )
      .jpeg( {quality: quality} )
      .toFile( resizeImagePath );

    return resizeImagePath;
  }

  async resizeReference (imagePath) {

    console.log('[ImageProcessor] resizeReference', arguments);

    const results = await Promise.all([

      await ImageProcessor.resize(imagePath, '_250x250.jpg', 250, 250, 80),
      await ImageProcessor.resize(imagePath, '_500x500.jpg', 500, 500, 90),
      await ImageProcessor.resize(imagePath, '_660.jpg', 660, undefined, 90),
      await ImageProcessor.convertToJpeg(imagePath, 97)
    ]);

    return {
      sm: results[0],
      md: results[1],
      lg: results[2],
      full_jpeg: results[3]
    }
  }

  async resizeTestResult (imagePath) {

    console.log('[ImageProcessor] resizeTestResult', arguments);

    // await ImageProcessor.convertToJpeg(imagePath, 97)
    return await ImageProcessor.resize(imagePath, '_660.jpg', 660, undefined, 97);
  }
}


const imageProcessor = new ImageProcessor();


module.exports = {

  resizeReference: imageProcessor.resizeReference,
  resizeTestResult: imageProcessor.resizeTestResult
}
