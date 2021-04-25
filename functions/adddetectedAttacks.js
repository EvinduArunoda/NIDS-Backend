const admin = require('firebase-admin');
const mailjet = require ('node-mailjet')
    .connect('23a5cdde93997c5e9dd69bccfcbd2367', 'a84c1c6dfbdd929ab58de434264862b9')

exports.handler = async (req, res) => {
    const data = req.body;
    let actionsToTake = data.actionsToTake || [];
    if (data) {
        await admin.firestore().collection("Attacks").doc().set({
            actionsToTake : actionsToTake,
            ipAddress: data.ipAddress || '',
            timestamp: admin.firestore.Timestamp.now(),
            type: data.type || ''
        });

        await admin.firestore().collection("Configs").doc("read_check").update({
            read: false
        })

        try {
            await mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                            "From": {
                                "Email": "nishara.2017431@iit.ac.lk",
                                "Name": "NIDS"
                            },
                            "To": [
                                {
                                    "Email": "rsnramasinghe@gmail.com",
                                    "Name": "Rishie"
                                }
                            ],
                            "Subject": "Attack Detected !",
                            "TextPart": "Attack Detected !",
                            "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                            "HTMLPart": `<span>Attack Detected !<br/><br/> Attack Type: ${data.type || ''}<br/> Follow these actions to avoid these attacks,<br/>${actionsToTake.join(', ')}</span>`,
                            "CustomID": "AppGettingStartedTest"
                        }
                    ]
                })
        } catch (e) {
            console.log('Error :', e)
        }


    }
    console.log(data)
    res.status(200).send()
}