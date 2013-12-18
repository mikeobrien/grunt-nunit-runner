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

    it('should generate TeamCity service messages', function() {

        var log = nunit.createTeamcityLog('test/Data/TestResults.xml');

        expect(log[0]).to.be('##teamcity[testSuiteStarted name=\'mock-assembly.dll\']');
            expect(log[1]).to.be('##teamcity[testSuiteStarted name=\'NUnit\']');
                expect(log[2]).to.be('##teamcity[testSuiteStarted name=\'Tests\']');
                    expect(log[3]).to.be('##teamcity[testSuiteStarted name=\'Assemblies\']');
                        expect(log[4]).to.be('##teamcity[testSuiteStarted name=\'MockTestFixture\']');
                            expect(log[5]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.FailingTest\']');
                                expect(log[6]).to.be('##teamcity[testFailed name=\'NUnit.Tests.Assemblies.MockTestFixture.FailingTest\' message=\'Intentional failure\' details=\'at NUnit.Tests.Assemblies.MockTestFixture.FailingTest()|r|n\']');
                            expect(log[7]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.FailingTest\' duration=\'16\']');
                            expect(log[8]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.InconclusiveTest\']');
                                expect(log[9]).to.be('##teamcity[testFailed name=\'NUnit.Tests.Assemblies.MockTestFixture.InconclusiveTest\' message=\'No valid data\']');
                            expect(log[10]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.InconclusiveTest\' duration=\'0\']');
                            expect(log[11]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest1\']');
                            expect(log[12]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest1\' duration=\'0\']');
                            expect(log[13]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest2\']');
                            expect(log[14]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest2\' duration=\'0\']');
                            expect(log[15]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest3\']');
                            expect(log[16]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest3\' duration=\'16\']');
                            expect(log[17]).to.be('##teamcity[testIgnored name=\'NUnit.Tests.Assemblies.MockTestFixture.MockTest4\' message=\'ignoring this test method for now\']');
                            expect(log[18]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.TestWithException\']');
                                expect(log[19]).to.be('##teamcity[testFailed name=\'NUnit.Tests.Assemblies.MockTestFixture.TestWithException\' message=\'System.ApplicationException : Intentional Exception\' details=\'at NUnit.Tests.Assemblies.MockTestFixture.MethodThrowsException()|r|nat NUnit.Tests.Assemblies.MockTestFixture.TestWithException()|r|n\']');
                            expect(log[20]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.TestWithException\' duration=\'0\']');
                            expect(log[21]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Assemblies.MockTestFixture.TestWithManyProperties\']');
                            expect(log[22]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Assemblies.MockTestFixture.TestWithManyProperties\' duration=\'0\']');
                        expect(log[23]).to.be('##teamcity[testSuiteFinished name=\'MockTestFixture\']');
                    expect(log[24]).to.be('##teamcity[testSuiteFinished name=\'Assemblies\']');
                    expect(log[25]).to.be('##teamcity[testSuiteStarted name=\'BadFixture\']');
                    expect(log[26]).to.be('##teamcity[testSuiteFinished name=\'BadFixture\']');
                    expect(log[27]).to.be('##teamcity[testSuiteStarted name=\'FixtureWithTestCases\']');
                        expect(log[28]).to.be('##teamcity[testSuiteStarted name=\'GenericMethod\']');
                            expect(log[29]).to.be('##teamcity[testStarted name=\'NUnit.Tests.FixtureWithTestCases.GenericMethod<Int32>(2,4)\']');
                            expect(log[30]).to.be('##teamcity[testFinished name=\'NUnit.Tests.FixtureWithTestCases.GenericMethod<Int32>(2,4)\' duration=\'0\']');
                            expect(log[31]).to.be('##teamcity[testStarted name=\'NUnit.Tests.FixtureWithTestCases.GenericMethod<Double>(9.2d,11.7d)\']');
                            expect(log[32]).to.be('##teamcity[testFinished name=\'NUnit.Tests.FixtureWithTestCases.GenericMethod<Double>(9.2d,11.7d)\' duration=\'0\']');
                        expect(log[33]).to.be('##teamcity[testSuiteFinished name=\'GenericMethod\']');
                        expect(log[34]).to.be('##teamcity[testSuiteStarted name=\'MethodWithParameters\']');
                            expect(log[35]).to.be('##teamcity[testStarted name=\'NUnit.Tests.FixtureWithTestCases.MethodWithParameters(2,2)\']');
                            expect(log[36]).to.be('##teamcity[testFinished name=\'NUnit.Tests.FixtureWithTestCases.MethodWithParameters(2,2)\' duration=\'0\']');
                            expect(log[37]).to.be('##teamcity[testStarted name=\'NUnit.Tests.FixtureWithTestCases.MethodWithParameters(9,11)\']');
                            expect(log[38]).to.be('##teamcity[testFinished name=\'NUnit.Tests.FixtureWithTestCases.MethodWithParameters(9,11)\' duration=\'0\']');
                        expect(log[39]).to.be('##teamcity[testSuiteFinished name=\'MethodWithParameters\']');
                    expect(log[40]).to.be('##teamcity[testSuiteFinished name=\'FixtureWithTestCases\']');
                    expect(log[41]).to.be('##teamcity[testSuiteStarted name=\'GenericFixture<T>\']');
                        expect(log[42]).to.be('##teamcity[testSuiteStarted name=\'GenericFixture<Double>(11.5d)\']');
                            expect(log[43]).to.be('##teamcity[testStarted name=\'NUnit.Tests.GenericFixture<Double>(11.5d).Test1\']');
                            expect(log[44]).to.be('##teamcity[testFinished name=\'NUnit.Tests.GenericFixture<Double>(11.5d).Test1\' duration=\'0\']');
                            expect(log[45]).to.be('##teamcity[testStarted name=\'NUnit.Tests.GenericFixture<Double>(11.5d).Test2\']');
                            expect(log[46]).to.be('##teamcity[testFinished name=\'NUnit.Tests.GenericFixture<Double>(11.5d).Test2\' duration=\'0\']');
                        expect(log[47]).to.be('##teamcity[testSuiteFinished name=\'GenericFixture<Double>(11.5d)\']');
                        expect(log[48]).to.be('##teamcity[testSuiteStarted name=\'GenericFixture<Int32>(5)\']');
                            expect(log[49]).to.be('##teamcity[testStarted name=\'NUnit.Tests.GenericFixture<Int32>(5).Test1\']');
                            expect(log[50]).to.be('##teamcity[testFinished name=\'NUnit.Tests.GenericFixture<Int32>(5).Test1\' duration=\'0\']');
                            expect(log[51]).to.be('##teamcity[testStarted name=\'NUnit.Tests.GenericFixture<Int32>(5).Test2\']');
                            expect(log[52]).to.be('##teamcity[testFinished name=\'NUnit.Tests.GenericFixture<Int32>(5).Test2\' duration=\'0\']');
                        expect(log[53]).to.be('##teamcity[testSuiteFinished name=\'GenericFixture<Int32>(5)\']');
                    expect(log[54]).to.be('##teamcity[testSuiteFinished name=\'GenericFixture<T>\']');
                    expect(log[55]).to.be('##teamcity[testSuiteStarted name=\'IgnoredFixture\']');
                        expect(log[56]).to.be('##teamcity[testIgnored name=\'NUnit.Tests.IgnoredFixture.Test1\']');
                        expect(log[57]).to.be('##teamcity[testIgnored name=\'NUnit.Tests.IgnoredFixture.Test2\']');
                        expect(log[58]).to.be('##teamcity[testIgnored name=\'NUnit.Tests.IgnoredFixture.Test3\']');
                    expect(log[59]).to.be('##teamcity[testSuiteFinished name=\'IgnoredFixture\']');
                    expect(log[60]).to.be('##teamcity[testSuiteStarted name=\'ParameterizedFixture\']');
                        expect(log[61]).to.be('##teamcity[testSuiteStarted name=\'ParameterizedFixture(42)\']');
                            expect(log[62]).to.be('##teamcity[testStarted name=\'NUnit.Tests.ParameterizedFixture(42).Test1\']');
                            expect(log[63]).to.be('##teamcity[testFinished name=\'NUnit.Tests.ParameterizedFixture(42).Test1\' duration=\'0\']');
                            expect(log[64]).to.be('##teamcity[testStarted name=\'NUnit.Tests.ParameterizedFixture(42).Test2\']');
                            expect(log[65]).to.be('##teamcity[testFinished name=\'NUnit.Tests.ParameterizedFixture(42).Test2\' duration=\'0\']');
                        expect(log[66]).to.be('##teamcity[testSuiteFinished name=\'ParameterizedFixture(42)\']');
                        expect(log[67]).to.be('##teamcity[testSuiteStarted name=\'ParameterizedFixture(5)\']');
                            expect(log[68]).to.be('##teamcity[testStarted name=\'NUnit.Tests.ParameterizedFixture(5).Test1\']');
                            expect(log[69]).to.be('##teamcity[testFinished name=\'NUnit.Tests.ParameterizedFixture(5).Test1\' duration=\'0\']');
                            expect(log[70]).to.be('##teamcity[testStarted name=\'NUnit.Tests.ParameterizedFixture(5).Test2\']');
                            expect(log[71]).to.be('##teamcity[testFinished name=\'NUnit.Tests.ParameterizedFixture(5).Test2\' duration=\'0\']');
                        expect(log[72]).to.be('##teamcity[testSuiteFinished name=\'ParameterizedFixture(5)\']');
                    expect(log[73]).to.be('##teamcity[testSuiteFinished name=\'ParameterizedFixture\']');
                    expect(log[74]).to.be('##teamcity[testSuiteStarted name=\'Singletons\']');
                        expect(log[75]).to.be('##teamcity[testSuiteStarted name=\'OneTestCase\']');
                            expect(log[76]).to.be('##teamcity[testStarted name=\'NUnit.Tests.Singletons.OneTestCase.TestCase\']');
                            expect(log[77]).to.be('##teamcity[testFinished name=\'NUnit.Tests.Singletons.OneTestCase.TestCase\' duration=\'0\']');
                        expect(log[78]).to.be('##teamcity[testSuiteFinished name=\'OneTestCase\']');
                    expect(log[79]).to.be('##teamcity[testSuiteFinished name=\'Singletons\']');
                    expect(log[80]).to.be('##teamcity[testSuiteStarted name=\'TestAssembly\']');
                        expect(log[81]).to.be('##teamcity[testSuiteStarted name=\'MockTestFixture\']');
                            expect(log[82]).to.be('##teamcity[testStarted name=\'NUnit.Tests.TestAssembly.MockTestFixture.MyTest\']');
                            expect(log[83]).to.be('##teamcity[testFinished name=\'NUnit.Tests.TestAssembly.MockTestFixture.MyTest\' duration=\'0\']');
                        expect(log[84]).to.be('##teamcity[testSuiteFinished name=\'MockTestFixture\']');
                    expect(log[85]).to.be('##teamcity[testSuiteFinished name=\'TestAssembly\']');
                expect(log[86]).to.be('##teamcity[testSuiteFinished name=\'Tests\']');
            expect(log[87]).to.be('##teamcity[testSuiteFinished name=\'NUnit\']');
        expect(log[88]).to.be('##teamcity[testSuiteFinished name=\'mock-assembly.dll\']');

    });
});