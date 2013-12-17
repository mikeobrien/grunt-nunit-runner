var expect = require('expect.js'),
    fs = require('fs'),
    nunit = require('../tasks/nunit.js');

describe('nunit', function() {

    it('should find assembly', function() {

        var assemblies = nunit.findTestAssemblies(['test/Data/Solution/bin/Debug/Project.ClassLibrary.dll']);
        expect(assemblies.length).to.be(1);
        expect(assemblies[0]).to.be('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll');

    });

    it('should fail when cant find assembly', function() {

        var path = 'test/Data/Project.ClassLibrary.dll';
        expect(function() { nunit.findTestAssemblies([path]); }).
            to.throwException(function(e) { expect(e.message).to.contain(path); });

    });

    it('should assembly in project', function() {

        var assemblies = nunit.findTestAssemblies(['test/Data/Solution/Project.ClassLibrary.csproj']);
        expect(assemblies.length).to.be(1);
        expect(assemblies[0]).to.be('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll');

    });

    it('should fail when cant find assembly in project', function() {

        var path = 'test/Data/NoAssemblies/Project.ClassLibrary.csproj';
        expect(function() { nunit.findTestAssemblies([path]); }).
            to.throwException(function(e) { expect(e.message).to.contain(path); });

    });

    it('should assembly in solution', function() {

        var assemblies = nunit.findTestAssemblies(['test/Data/Solution/Solution.sln']);
        expect(assemblies.length).to.be(1);
        expect(assemblies[0]).to.be('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll');

    });

    it('should create command with all parameters', function() {

        var command = nunit.buildCommand(['path/to/file1.dll', 'path/to/file2.dll'], {
            path: 'c:\\Program Files\\NUnit\\bin',
            platform: 'x86',
            run: ['TestSuite.Unit', 'TestSuite.Integration'],
            runlist: 'TestsToRun.txt',
            config: 'Debug',
            result: 'TestResult.xml',
            noresult: true,
            output: 'TestOutput.txt',
            err: 'TestErrors.txt',
            work: 'BuildArtifacts',
            labels: true,
            trace: 'Verbose',
            include: ['BaseLine', 'Unit'],
            exclude: ['Database', 'Network'],
            framework: 'net-1.1',
            process: 'Single',
            domain: 'Multiple',
            apartment: 'STA',
            noshadow: true,
            nothread: true,
            basepath: 'src',
            privatebinpath: ['lib', 'bin'],
            timeout: 1000,
            wait: true,
            nologo: true,
            nodots: true,
            stoponerror: true,
            cleanup: true
        });

        expect(command.path).to.be('c:/Program Files/NUnit/bin/nunit-console-x86.exe');
        expect(command.args[0]).to.be('"path/to/file1.dll"');
        expect(command.args[1]).to.be('"path/to/file2.dll"');
        expect(command.args[2]).to.be('/run:"TestSuite.Unit,TestSuite.Integration"');
        expect(command.args[3]).to.be('/runlist:"TestsToRun.txt"');
        expect(command.args[4]).to.be('/config:"Debug"');
        expect(command.args[5]).to.be('/result:"TestResult.xml"');
        expect(command.args[6]).to.be('/noresult');
        expect(command.args[7]).to.be('/output:"TestOutput.txt"');
        expect(command.args[8]).to.be('/err:"TestErrors.txt"');
        expect(command.args[9]).to.be('/work:"BuildArtifacts"');
        expect(command.args[10]).to.be('/labels');
        expect(command.args[11]).to.be('/trace:Verbose');
        expect(command.args[12]).to.be('/include:"BaseLine,Unit"');
        expect(command.args[13]).to.be('/exclude:"Database,Network"');
        expect(command.args[14]).to.be('/framework:"net-1.1"');
        expect(command.args[15]).to.be('/process:Single');
        expect(command.args[16]).to.be('/domain:Multiple');
        expect(command.args[17]).to.be('/apartment:STA');
        expect(command.args[18]).to.be('/noshadow');
        expect(command.args[19]).to.be('/nothread');
        expect(command.args[20]).to.be('/basepath:"src"');
        expect(command.args[21]).to.be('/privatebinpath:"lib;bin"');
        expect(command.args[22]).to.be('/timeout:1000');
        expect(command.args[23]).to.be('/wait');
        expect(command.args[24]).to.be('/nologo');
        expect(command.args[25]).to.be('/nodots');
        expect(command.args[26]).to.be('/stoponerror');
        expect(command.args[27]).to.be('/cleanup');

    });

    it('should create command with a few parameters', function() {

        var command = nunit.buildCommand(['path/to/file1.dll', 'path/to/file2.dll'], {
            config: 'Debug',
            result: 'TestResult.xml',
        });

        expect(command.path).to.be('nunit-console.exe');
        expect(command.args[0]).to.be('"path/to/file1.dll"');
        expect(command.args[1]).to.be('"path/to/file2.dll"');
        expect(command.args[2]).to.be('/config:"Debug"');
        expect(command.args[3]).to.be('/result:"TestResult.xml"');

    });

    it('should generate TeamCity service messages', function(done) {

        nunit.toTeamcityLog('test/Data/TestResults.xml').then(function(log) {
            console.log(log);
            done();
        });

    });

});