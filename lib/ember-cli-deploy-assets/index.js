/* eslint-env node */
'use strict';

var RSVP = require('rsvp');
var glob  = require('glob');
var DeployPluginBase = require('ember-cli-deploy-plugin');
var path = require('path');
var copydir = require('copy-dir');

module.exports = {
  name: 'ember-cli-deploy-copy-assets',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        environment: 'production',
        outputPath: 'tmp' + path.sep + 'deploy-dist',
        startPath: 'dist',
        filePattern: 'assets/**/*.{js,css,json,ico,map,xml,txt,svg,eot,ttf,woff,woff2}'
      },

      build: function(context) {
        var self        = this;
        var outputPath  = this.readConfig('outputPath');
        var startPath   = this.readConfig('startPath');
        var filePattern = this.readConfig('filePattern');
        var buildEnv    = this.readConfig('environment');

        this.log('copying build artifacts from `' + startPath + '` to `' + outputPath + '`...', { verbose: true});

        copydir.sync(startPath, outputPath)

        return this._logSuccess(outputPath, filePattern)
          .then(function(files) {
            files = files || [];

            return {
              distDir: outputPath,
              distFiles: files
            };
          })
          .catch(function(error) {
            self.log('build failed', { color: 'red' });
            return RSVP.reject(error);
          });
      },
      _logSuccess: function(outputPath, filePattern) {
        var self = this;
        var files = glob.sync(filePattern, { nonull: false, nodir: true, cwd: outputPath });

        if (files && files.length) {
          files.forEach(function(path) {
            self.log('✔  ' + path, { verbose: true });
          });
        }
        self.log('build ok', { verbose: true });

        return RSVP.resolve(files);
      }
    });
    return new DeployPlugin();
  }
};
