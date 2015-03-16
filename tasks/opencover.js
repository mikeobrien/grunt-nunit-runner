exports.wrapCommand = function(command, options) {
    var pathToOpencover = options.coverPath;
    var wrappedArgs = [];
    wrappedArgs.push('-target:"' + command.path + '"');
    wrappedArgs.push('-targetargs:"' + command.args.join(' ') + '"');
    wrappedArgs.push('-register:user');
    wrappedArgs.push('-returntargetcode');
    
    var coverReportFilePath = '_CodeCoverageResult.xml';
    if (options.coverReportFilePath && options.coverReportFilePath !== '') {
        coverReportFilePath = '"' + options.coverReportFilePath + '"';
    }
    wrappedArgs.push('-output:' + coverReportFilePath);

    if (options.coverFilter && options.coverFilter !== '') {
        wrappedArgs.push('-filter:"' + options.coverFilter + '"');
    }

    if (options.coverExcludeAttributeFilter && options.coverExcludeAttributeFilter !== '') {
        wrappedArgs.push('-excludebyattribute:"' + options.coverExcludeAttributeFilter + '"');
    }

    return {
        path: pathToOpencover,
        args: wrappedArgs
    };
};