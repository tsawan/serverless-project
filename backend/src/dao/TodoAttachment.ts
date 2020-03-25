// default attachment storage layer for todos.

import * as AWS from "aws-sdk";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: "v4"
});

export class TodoAttachment {
  static getImageUrl(imageId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${imageId}`;
  }
  
  static getSignedUrl(imageId: string) {
    return s3.getSignedUrl("putObject", {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration)
    });
  }
}
