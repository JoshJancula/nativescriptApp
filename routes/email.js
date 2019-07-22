const sgMail = require('@sendgrid/mail');
const JancstaPort = require('../config/jancsta');

module.exports = (app) => {

    app.post("/api/email", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(req.body);
            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        });
    });

}