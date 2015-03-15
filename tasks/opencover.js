exports.wrapCommand = function(command, options) {
    var pathToOpencover = options.coverPath;
    var wrappedArgs = [];
    wrappedArgs.push('-target:"' + command.path + '"');
    wrappedArgs.push('-targetargs:"' + command.args.join(' ') + '"');
    wrappedArgs.push('-register:user');
    wrappedArgs.push('-output:_CodeCoverageResult.xml');

    return {
        path: pathToOpencover,
        args: wrappedArgs
    };
};