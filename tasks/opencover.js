exports.wrapCommand = function(command) {
    var pathToOpencover = 'C:\\src\\moderator\\build\\bin\\opencover\\OpenCover.Console.exe';
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