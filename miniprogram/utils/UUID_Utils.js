function simpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function generateUUIDFromString(str) {
    var hash = simpleHash(str);
    var sections = [4, 2, 2, 2, 6];
    var uuid = '';
    for (var i = 0; i < sections.length; i++) {
        if (i > 0) {
            uuid += '-';
        }
        for (var j = 0; j < sections[i]; j++) {
            var value = (hash & 0xf).toString(16);
            uuid += value;
            hash = hash >> 4;
        }
    }
    return uuid;
}
module.exports = {
    generateUUIDFromString: generateUUIDFromString
}