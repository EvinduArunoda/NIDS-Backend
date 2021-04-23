// Require gcloud
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { firestore } = require('firebase-admin');

exports.handler = async (req, res) => {
    console.log('inside');
    const bucket = admin.storage().bucket();
    if (req.method !== 'POST') {
        return res.status(405).end();
    }
    const busboy = new Busboy({headers: req.headers});
    const tmpdir = os.tmpdir();

    const fields = {};

    const uploads = {};

    busboy.on('field', (fieldname, val) => {
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    const fileWrites = [];
    const fileNames = {};

    busboy.on('file', (fieldname, file, filename) => {
        console.log(`Processed file ${filename}`);
        fileNames[fieldname] = filename;
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });
    busboy.on('finish', async () => {
        await Promise.all(fileWrites);
        // upload file to firebase storage
        await bucket.upload(uploads['file'], {
            destination: fields['id']+ uploads['file'],
            metadata: {
                contentType: 'image',
            },
        });

        // create url
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
        }/o/${fields['id']}%2Ftmp%2F${fileNames['file']}?alt=media`;

        // create document in result collection of firestore
        await admin.firestore().collection('results').doc(fields['id']).set({
            'img': publicUrl
        });


        for (const file in uploads) {
            fs.unlinkSync(uploads[file]);
        }

        res.status(200).send({
            'img': publicUrl
        });
    });

    busboy.end(req.rawBody);
}