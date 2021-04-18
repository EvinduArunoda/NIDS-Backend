// Require gcloud
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId: 'data-model-ui', keyFilename: './service-account.json' });
const stream = require('stream');

exports.handler = async (req, response) => {

    const bucket = await storage.bucket('gs://data-model-db.appspot.com');


    let pictureURL
    const image = req.body.image
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
    const fileName = req.body.file
//trim off the part of the payload that is not part of the base64 string
    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
// Define file and fileName
    const file = bucket.file('images/' + fileName);
    bufferStream.pipe(file.createWriteStream({
        metadata: {
            contentType: mimeType
        },
        public: true,
        validation: "md5"
    }))
        .on('error', function (err) {
            console.log('error from image upload', err);
        })
        .on('finish', function () {
            // The file upload is complete.
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }).then(signedUrls => {
                // signedUrls[0] contains the file's public URL
                pictureURL = signedUrls[0]
            });
        });


   ///////////////////////////////
    console.log(request.body)
    response.status(200).send(request.body)
}