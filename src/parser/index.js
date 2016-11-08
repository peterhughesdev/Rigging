module.exports = function Parser() {

};

Parser.read = function(blob) {
    return blob.split('---');  
};
