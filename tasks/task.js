var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('nunit', 'Runs the NUnit test runner.', function() {
        var options = this.options({});
        console.log('oh hai');



        /*
            nunit-console.exe [inputfiles] [options]
            nunit-console-x86.exe [inputfiles] [options]

/fixture=STR            Test fixture or namespace to be loaded (Deprecated) (Short format: /load=STR)
/run=STR                Name of the test case(s), fixture(s) or namespace(s) torun
/runlist=STR            Name of a file containing a list of the tests to run, one per line
/config=STR             Project configuration (e.g.: Debug) to load
/result=STR             Name of XML result file (Default: TestResult.xml) (Short format: /xml=STR)
/xmlConsole             Display XML to the console (Deprecated)
/noresult               Suppress XML result output (Short format: /noxml)
/output=STR             File to receive test output (Short format: /out=STR)
/err=STR                File to receive test error output
/work=STR               Work directory for output files
/labels                 Label each test in stdOut
/trace=X                Set internal trace level: Off, Error, Warning, Info, Verbose
/include=STR            List of categories to include
/exclude=STR            List of categories to exclude
/framework=STR          Framework version to be used for tests
/process=X              Process model for tests: Single, Separate, Multiple
/domain=X               AppDomain Usage for tests: None, Single, Multiple
/apartment=X            Apartment for running tests: MTA (Default), STA
/noshadow               Disable shadow copy when running in separate domain
/nothread               Disable use of a separate thread for tests
/basepath=STR           Base path to be used when loading the assemblies
/privatebinpath=STR     Additional directories to be probed when loading assemblies, separated by semicolons
/timeout=X              Set timeout for each test case in milliseconds
/wait                   Wait for input before closing console window
/nologo                 Do not display the logo
/nodots                 Do not display progress
/stoponerror            Stop after the first test failure or error
/cleanup                Erase any leftover cache files and exit


        */
    });
};
