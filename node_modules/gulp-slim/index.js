(function() {
  var PLUGIN_NAME, gutil, spawn, through;

  spawn = require('child_process').spawn;

  through = require('through2');

  gutil = require('gulp-util');

  PLUGIN_NAME = 'gulp-slim';

  module.exports = function(options) {
    var args, cmnd;
    if (options == null) {
      options = {};
    }
    cmnd = 'slimrb';
    args = [];
    args.push('-s');
    if (options.pretty) {
      args.push('-p');
    }
    if (options.erb) {
      args.push('-e');
    }
    if (options.compile) {
      args.push('-c');
    }
    if (options.rails) {
      args.push('-r');
    }
    if (options.translator) {
      args.push('-t');
    }
    if (options.logicLess) {
      args.push('-l');
    }
    return through.obj(function(file, encoding, callback) {
      var b, ext, program;
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return callback();
      }
      ext = options.erb ? '.erb' : '.html';
      file.path = gutil.replaceExtension(file.path, ext);
      program = spawn(cmnd, args);
      b = new Buffer(0);
      program.stdout.on('readable', (function(_this) {
        return function() {
          var chunk, _results;
          _results = [];
          while (chunk = program.stdout.read()) {
            _results.push(b = Buffer.concat([b, chunk], b.length + chunk.length));
          }
          return _results;
        };
      })(this));
      program.stdout.on('end', (function(_this) {
        return function() {
          file.contents = b;
          _this.push(file);
          return callback();
        };
      })(this));
      return program.stdin.write(file.contents, (function(_this) {
        return function() {
          return program.stdin.end();
        };
      })(this));
    });
  };

}).call(this);
