const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = function (token) {

    return new Promise(function (resolve, reject) {

        let date = moment(new Date()).format('MM/DD/YYYY');
        let compareThis = `${date}secret`;

        if (token) {
            bcrypt.compare(compareThis, token).then((res) => {
                if (res) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
                .catch((err) => {
                    console.log('err in jancstaPort: ', err);
                    reject(err);
                });
        } else {
            resolve(false);
        }
    });
}
