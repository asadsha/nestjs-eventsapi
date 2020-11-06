/* eslint-disable func-names */
/* eslint-disable no-undef */
import AWS from 'aws-sdk';
import * as env from 'dotenv';
env.config();

const UploadToAws = file => {
    const s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        Bucket: process.env.AWS_BUCKET,
    });

    return new Promise(function (resolve, reject) {
        s3bucket.createBucket(function () {
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: file.originalname,
                Body: file.buffer,
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ACL: 'public-read',
            };
            s3bucket.upload(params, function (err, data) {
                if (err) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject(`Could'nt upload Files!!!!! ${err}`);
                } else {
                    resolve(data.Location);
                }
            });
        });
    });
};

export default { UploadToAws };
