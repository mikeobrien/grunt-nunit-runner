var path = require('path'),
    temp = require('temp'),
    process = require('child_process'),
    nunit = require('./nunit.js');

module.exports = function(grunt) {

    grunt.registerMultiTask('nunit', 'Runs the NUnit test runner.', function() {
		
        var options = this.options({ nodots: !this.options().nunit3 });
        var cleanup;

        if (!options.result && options.teamcity) {
            temp.track();
            options.result = temp.path({ suffix: '.xml' });
            cleanup = temp.cleanup;
        }

        console.log();
        console.log('NUnit Task Runner');
        console.log();

        var assemblies = nunit.findTestAssemblies(this.filesSrc, options);
        var command = nunit.buildCommand(assemblies, options);

        console.log('Running tests in:');
        console.log();
        assemblies.forEach(function(file) { console.log('    ' + file); });
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
            if (cleanup) cleanup();
            if (code > 0) {
                grunt.log.error('Tests failed.');
                taskComplete(false);
            }
            taskComplete();
        });  

        nunitProcess.on('error', function(e) { 
            grunt.log.error(e.code === 'ENOENT' ? 'Unable to find NUnit Console.exe located at ' + command.path : e.message);
            taskComplete(false);
        });      
    });
};
