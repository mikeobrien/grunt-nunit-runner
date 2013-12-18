var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    msbuild = require('./msbuild.js'),
    sax = require('sax');

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

    var parser = sax.parser(true);
    var log = [];
    var ancestors = [];
    var message, stackTrace;

    var getAssemblyName = function(node) { return path.basename(node.attributes.name.replace(/\\/g, path.sep)); };

    parser.onopentag = function (node) {
        ancestors.push(node);
        switch (node.name) {
            case 'test-suite': 
                if (node.attributes.type === 'Assembly')
                    log.push('##teamcity[blockOpened name=\'' + getAssemblyName(node) + '\']'); 
                else log.push('##teamcity[testSuiteStarted name=\'' + node.attributes.name + '\']'); 
                break;
            case 'test-case': 
                if (node.attributes.executed === 'True') log.push('##teamcity[testStarted name=\'' + node.attributes.name + '\']'); 
                message = '';
                stackTrace = '';
                break; 
        }
    };

    parser.oncdata = function (data) {
        data = data.
            replace(/\|/g, '||').
            replace(/\'/g, '|\'').
            replace(/\n/g, '|n').
            replace(/\r/g, '|r').
            replace(/\u0085/g, '|x').
            replace(/\u2028/g, '|l').
            replace(/\u2029/g, '|p').
            replace(/\[/g, '|[').
            replace(/\]/g, '|]');

        switch (_.last(ancestors).name) {
            case 'message': message += data; break;
            case 'stack-trace': stackTrace += data; break;
        }
    };

    parser.onclosetag = function (node) {
        node = ancestors.pop();
        switch (node.name) {
            case 'test-suite':
                if (node.attributes.type === 'Assembly')
                    log.push('##teamcity[blockClosed name=\'' + getAssemblyName(node) + '\']'); 
                else log.push('##teamcity[testSuiteFinished name=\'' + node.attributes.name + '\']'); 
                break;
            case 'test-case': 
                if (node.attributes.result === 'Ignored')
                    log.push('##teamcity[testIgnored name=\'' + node.attributes.name + '\'' + 
                        (message ? ' message=\'' + message + '\'' : '') + ']'); 
                else if (node.attributes.executed === 'True') {
                    if (node.attributes.success === 'False') {
                        log.push('##teamcity[testFailed name=\'' + node.attributes.name + '\'' +
                            (message ? ' message=\'' + message + '\'' : '') + 
                            (stackTrace ? ' details=\'' + stackTrace + '\'' : '') + ']');
                    }
                    var duration = node.attributes.time ? ' duration=\'' + parseInt(
                        node.attributes.time.replace(/[\.\:]/g, '')) + '\'' : '';
                    log.push('##teamcity[testFinished name=\'' + node.attributes.name + '\'' + duration + ']');
                }
                break;
        }
    };

    parser.write(fs.readFileSync(results, 'utf8')).close();

    return log;
};