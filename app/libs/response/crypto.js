const CryptoJS = require("crypto-js");
const config = require('../../config');

/**
 * @param {*} text 
 * @returns ciphertext
 */

exports.encrypt = function (text) {
    try {
        // Encrypt
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), config.SECRET_KEY).toString();

        // console.log(ciphertext); 

        // Decrypt
        // var bytes = CryptoJS.AES.decrypt(ciphertext, config.SECRET_KEY);
        // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // console.log(decryptedData);

        return ciphertext;

    } catch (error) {
        console.log("\n catch-error", error);
    }
}