var VariableBucket = require('src/code/variables');

module.exports = function Rigging(sections) {
    var variables = new VariableBucket();
    var currentSection;

    this.goToSection = function(id) {
        var section = sections[id];

        if (section) {
            Object.keys(section).forEach(function(key) {
                variables.set(key, section[key]);
            });

            currentSection = section;
            return self.render(section);
        } else {
            throw new Error('Unknown section: ' + id);
        }
    };
};
