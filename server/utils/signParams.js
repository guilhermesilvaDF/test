import { LASTFM_SHARED_SECRET } from '../config/env.js';
import { md5 } from './crypto.js';

const signParams = (params) => {
    const keys = Object.keys(params).sort();
    let stringToSign = '';

    keys.forEach((key) => {
        if (key !== 'format' && key !== 'callback') {
            stringToSign += key + params[key];
        }
    });

    stringToSign += LASTFM_SHARED_SECRET;
    return md5(stringToSign);
};

export default signParams;