const { apiStatus } = require("./httpResponseService");
const cloudinary = require("../config/cloudinary");
const logger = require("../logger/appLogger");
const sharp = require("sharp");
const fsExtra = require("fs-extra");
const path = require("path");

class fileService {
  #image_dimension = {
    width: 700,
    height: 650,
  };

  /**
   * It takes a filepath, and returns a compressed filepath
   * @param filepath - The filepath of the image to be compressed
   * @param next - This is the next function that will be called after the image is resized.
   * @returns The compressed image path
   */
  async resizeImage(filepath, next) {
    let imagePath = path.join(__dirname, `../views/tmp/upload.jpg`);
    let compressedPath = path.join(__dirname, `../views/tmp/compress.jpg`);

    try {
      await filepath.mv(imagePath);
    } catch (e) {
      next(apiStatus.badRequest("Unable to process image"));
      return true;
    }

    try {
      await sharp(imagePath)
        .resize(this.#image_dimension)
        .jpeg({ quality: 80, chromaSubsampling: "4:4:4" })
        .toFile(compressedPath);

      return compressedPath;
    } catch (error) {
      next(apiStatus.badRequest("Unable to compress image"));
      return true;
    }
  }

  /**
   * It deletes all the files in the folder specified by the folderPath parameter
   * @param folderPath - The path to the folder where the uploaded image is stored.
   */
  async removeUploadedImageServerFile(folderPath) {
    try {
      await fsExtra.emptyDir(folderPath);
    } catch (err) {
      logger.error(err);
    }
  }

  async removeUploadedImageCloudFile(imageId) {
    try {
      await cloudinary.uploader.destroy(imageId, {
        upload_preset: "nothy_images",
      });
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * It takes a file, compresses it, and uploads it to cloudinary
   * @param file - The file to be uploaded
   * @param next - This is the next function that will be called after the image is uploaded.
   * @returns The image is being returned.
   */
  async fileUpload(file, next) {
    try {
      let compressedImage = await this.resizeImage(file, next);
      let result = await cloudinary.uploader.upload(compressedImage, {
        upload_preset: "nothy_images",
      });

      await this.removeUploadedImageServerFile(
        path.join(__dirname, `../views/tmp`)
      );

      return result;
    } catch (error) {
      logger.error(error);
      next(apiStatus.badRequest("Unable to upload image"));
      return true;
    }
  }
}

module.exports = new fileService();
