var path = require('path'),
    process = require('child_process'),
    nunit = require('../tasks/nunit.js');

module.exports = function(grunt) {
    grunt.registerTask('nunit', 'Runs the NUnit test runner.', function() {
        var options = this.options();

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
        var nunitProcess = process.spawn(command.path, command.args);

        nunitProcess.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        nunitProcess.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        nunitProcess.on('exit', function (code) {
            console.log('child process exited with code ' + code);
            taskComplete();
        });      
    });
};
