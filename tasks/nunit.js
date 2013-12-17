var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    msbuild = require('./msbuild.js'),
    XmlStream = require('xml-stream'),
    Q = require("q");

exports.findTestAssemblies = function(files) {
    var assemblies = [];
    var projects = [];
    files.forEach(function(file) {
        switch(path.extname(file)) {
            case '.sln': projects = projects.concat(msbuild.getSolutionProjectInfo(file)); break;
            case '.csproj': projects.push(msbuild.getProjectInfo(file)); break;
            default: {
                if (!fs.existsSync(file)) throw new Error('Assmebly not found: ' + file);
                assemblies.push(file);
            }
        }
    });
    projects.
        filter(function(project) { return _.contains(project.references, 'nunit.framework'); }).
        forEach(function(project) {
            var outputs = project.output.filter(function(output) { return fs.existsSync(output); });
            if (outputs.length === 0) throw new Error('No assemblies exist for project: ' + project.path);
            assemblies.push(outputs[0]);
        });
    return assemblies;
};

exports.buildCommand = function(files, options) {

    var nunit = options.platform === 'x86' ? 'nunit-console-x86.exe' : 'nunit-console.exe';
    if (options.path) nunit = path.join(options.path, nunit);

    nunit = nunit.replace(/\\/g, path.sep);

    var args = files.map(function(file) { return '"' + file + '"'; });

    if (options.run && options.run.length > 0) args.push('/run:"' + options.run.join(',') + '"');
    if (options.runlist) args.push('/runlist:"' + options.runlist + '"');
    if (options.config) args.push('/config:"' + options.config + '"');
    if (options.result) args.push('/result:"' + options.result + '"');
    if (options.noresult) args.push('/noresult');
    if (options.output) args.push('/output:"' + options.output + '"');
    if (options.err) args.push('/err:"' + options.err + '"');
    if (options.work) args.push('/work:"' + options.work + '"');
    if (options.labels) args.push('/labels');
    if (options.trace) args.push('/trace:' + options.trace);
    if (options.include && options.include.length > 0) args.push('/include:"' + options.include.join(',') + '"');
    if (options.exclude && options.exclude.length > 0) args.push('/exclude:"' + options.exclude.join(',') + '"');
    if (options.framework) args.push('/framework:"' + options.framework + '"');
    if (options.process) args.push('/process:' + options.process);
    if (options.domain) args.push('/domain:' + options.domain);
    if (options.apartment) args.push('/apartment:' + options.apartment);
    if (options.noshadow) args.push('/noshadow');
    if (options.nothread) args.push('/nothread');
    if (options.basepath) args.push('/basepath:"' + options.basepath + '"');
    if (options.privatebinpath && options.privatebinpath.length > 0) args.push('/privatebinpath:"' + options.privatebinpath.join(';') + '"');
    if (options.timeout) args.push('/timeout:' + options.timeout);
    if (options.wait) args.push('/wait');
    if (options.nologo) args.push('/nologo');
    if (options.nodots) args.push('/nodots');
    if (options.stoponerror) args.push('/stoponerror');
    if (options.cleanup) args.push('/cleanup');

    return {
        path: nunit,
        args: args
    };
};

//  this.SUITE_START   = '##teamcity[testSuiteStarted name=\'%s\']';
//  this.SUITE_END     = '##teamcity[testSuiteFinished name=\'%s\']';

// this.TEST_IGNORED  = '##teamcity[testIgnored name=\'%s\']';

//  this.TEST_START    = '##teamcity[testStarted name=\'%s\']';
//  this.TEST_FAILED   = '##teamcity[testFailed name=\'%s\' message=\'FAILED\' details=\'%s\']';
//  this.TEST_END      = '##teamcity[testFinished name=\'%s\' duration=\'%s\']';

//  this.BLOCK_OPENED  = '##teamcity[blockOpened name=\'%s\']';
//  this.BLOCK_CLOSED  = '##teamcity[blockClosed name=\'%s\']';

exports.toTeamcityLog = function(results) {
    var log = [];
    var assembly;
    var fixture = [];
    var namespace = [];
    var suite = [];
    var xml = new XmlStream(fs.createReadStream(results));

    var currentSuite = function() {
        return assembly + ': ' + namespace.join('.');
    };

    xml.on('startElement: test-suite', function(item) {
        switch (item.$.type) {
            case 'Assembly': suite.push(path.basename(item.$.name.replace(/\\/g, path.sep))); break;
            case 'Namespace':
            case 'TestFixture':
            case 'GenericFixture':
            case 'ParameterizedFixture':
            case 'ParameterizedTest':
                suite.push(item.$.name);
        }
        log.push('##teamcity[testSuiteStarted name=\'' + _.last(suite) + '\']');

        //switch (item.$.type) {
        //    case 'Assembly': assembly = path.basename(item.$.name.replace(/\\/g, path.sep)); break;
        //    case 'Namespace': namespace.push(item.$.name); break;
        //    case 'TestFixture':
        //    case 'GenericFixture':
        //    case 'ParameterizedFixture':
        //    case 'ParameterizedTest':
        //        if (!fixture.length) log.push('Running test suite: ' + currentSuite());
        //        fixture.push(item.$.name);
        //}
    });

    var testCase;
    var testCaseDuration;
    var testExecuted;

    xml.on('startElement: test-case', function(item) {
        testCase = item.$.name;
        testCaseDuration = item.$.time;
        testExecuted = item.$.executed;
        log.push('##teamcity[testStarted name=\'' + testCase + '\']');
    });

    xml.on('endElement: test-case', function(item) {
        log.push('##teamcity[testFinished name=\'' + testCase + '\'' +
            (testExecuted === 'True' ? ' duration=\'' + parseInt(testCaseDuration.replace(/[\.\:]/g, '')) + '\'' : '') + 
            ']');
    });

    xml.on('endElement: test-suite', function(item) {
        log.push('##teamcity[testSuiteStarted name=\'' + suite.pop() + '\']');

        //if (fixture.length) fixture.pop();
        //else namespace.pop();
    });

    var complete = Q.defer();
    xml.on('end', function() { complete.resolve(log); });
    return complete.promise;
};