var path = require('path'),
    temp = require('temp'),
    process = require('child_process'),
    _ = require('underscore'),
    nunit = require('../tasks/nunit.js'),
    Q = require("q");

module.exports = function(grunt) {
    grunt.registerTask('nunit', 'Runs the NUnit test runner.', function() {
        var options = this.options();
        var cleanup;

        if (!options.result && options.teamcity) {
            temp.track();
            options.result = temp.path({ suffix: '.xml' });
            cleanup = temp.cleanup;
        }

        console.log();
        console.log('NUnit Task Runner');
        console.log();

        var files = nunit.findTestAssemblies(options.files);
        var command = nunit.buildCommand(files, options);

        console.log('Running tests in:');
        console.log();
        files.forEach(function(file) { console.log('    ' + file); });
        console.log();

        console.log(command.path + ' ' + command.args.join(' '));
        console.log();

        var taskComplete = this.async();
        var nunitProcess = process.spawn(command.path, command.args, { windowsVerbatimArguments: true });

        var log = function(message) { console.log(message.toString('utf8')); };

        nunitProcess.stdout.on('data', log);
        nunitProcess.stderr.on('data', log);

        var complete = Q.defer();

        nunitProcess.on('exit', function(code) { complete.resolve({ code: code }); });

        complete = complete.promise;

        if (options.teamcity) {
            complete = complete.then(function(result) {
                return nunit.toTeamcityLog(options.result).
                    then(function(log) { return _.extend(result, { log: log }); });
            });
        }

        complete.then(function (result) {
            if (result.log && result.log.length > 0) console.log(result.log.join('\r\n'));
            if (result.code > 0) grunt.fail.fatal('Tests failed.');
            if (cleanup) cleanup();
            taskComplete();
        }).done();     
    });
};
