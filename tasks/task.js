var path = require('path'),
    temp = require('temp'),
    process = require('child_process'),
    _ = require('underscore'),
    nunit = require('../tasks/nunit.js');

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

        nunitProcess.on('exit', function(code) { 
            if (options.teamcity) console.log(nunit.createTeamcityLog(options.result).join(''));
            if (code > 0) grunt.fail.fatal('Tests failed.');
            if (cleanup) cleanup();
            taskComplete();
        });    
    });
};
