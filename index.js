const R   = require('ramda');

/* TODO: distinguish between:
 - login failed (bad credentials)
 - request failed because of insufficient permissions (logged in but don't have access)
 - request failed because not logged in
 */
const redFlags = [
    'unauthorized',
    'unauthorised',
    'please log in to',
    'you could not be logged in',
    'secure zone access denied'
];

/**
 * string -> string
 *
 * @param {String} s
 * @returns {string}
 */
const toLowerCase = (s) => {
    return String.prototype.toLowerCase.apply(s)
};


/**
 * Does the text contain the flag? (case insensitive)
 *
 * Text -> Flag -> Bool
 *
 * @param {String} flag
 * @param {String} text
 * @returns {boolean}
 */
const flagPresent = R.curry((text, flag) => {
        const lowercaseText = toLowerCase(text);
return lowercaseText.indexOf(flag) >= 0;
});


/**
 *
 * @param flags {Array<String>}
 * @param text {String}
 */
const mapFlagPresence = (flags, text) => {
    return R.map(flagPresent(text), flags)
};


/**
 *
 * (Flags, Text) -> Bool
 *
 * @param {Array<String>} flags
 * @param {String} text
 * @type {Function}
 */
const checkFlags = R.pipe(
    mapFlagPresence,
    R.any(R.equals(true))
);


/**
 * Is the response BC's version of a '401 Unauthorized' error?
 *
 * Response -> Boolean
 *
 * @param response
 * @returns {Boolean}
 */
const checkLoginResponse = function (response) {
    return checkFlags(redFlags, response.body);
};


const patchAuthErrorResponses = (request) => {
    const statusShouldBe401 = request.status === 200 && checkLoginResponse(request);

    if (statusShouldBe401) {
        request.status = 401;
        request.statusText = 'Unauthorized';
        return request;
    }

    return request;
};


module.exports = {
    patchAuthErrorResponses,
    checkLoginResponse,
    toLowerCase,
    flagPresent,
    mapFlagPresence,
    checkFlags
};