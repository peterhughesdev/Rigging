module.exports = function Variables() {
    var listeners = [];
    var vars = {};

    this.has = function(key) {
        return vars[key] !== undefined;
    };

    this.set = function(key, val) {
        var old = vars[key];
        vars[key] = val;

        listeners.forEach(function(listener) {
            listener(key, val, old);
        });
    };

    this.listen = function(listener) {
        listeners.push(listener); 
    };
};
