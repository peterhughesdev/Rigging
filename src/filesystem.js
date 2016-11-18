const Nunjucks = require('nunjucks');
const fs = require('fs');

module.exports = function FileSystem(opts) {
    let currentFile = opts.storage.getItem('currentFile');

    if (opts.autoLoad) {
        internalLoad(currentFile);
    }

    function setCurrent(filename) {
        opts.storage.setItem('currentFile', filename);
        currentFile = filename;
    }

    function internalSave(filename, contents) {
        fs.writeFile(filename, JSON.stringify(contents), function(err) {
            if (err) {
                opts.onError(err);
            } 

            setCurrent(filename);
        });
    }

    function internalLoad(filename) {
        if (filename) {
            fs.readFile(filename, 'utf-8', function(err, data) {
                if (err) {
                    opts.onError(err);
                } else {
                    opts.setContents(JSON.parse(data));
                    setCurrent(filename);
                }
            });
        }
    }

    this.saveFile = function() {
        var contents = opts.getContents();

        if (currentFile) {
            internalSave(currentFile, contents);
        } else {
            opts.getSaveFilename(function(filename) {
                internalSave(filename, contents);
            });
        } 
    };

    this.loadFile = function() {
        opts.getLoadFilename(internalLoad);
    };

    this.newFile = function() {
        opts.setContents({});
        setCurrent('');
    };
}
