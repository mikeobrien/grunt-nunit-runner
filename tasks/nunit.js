var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    msbuild = require('./msbuild.js');

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