var expect = require('expect.js'),
nunit = require('../tasks/nunit.js'),
path = require('path');

describe('nunit', function() {

    it('should find a default assembly', function() {

        var assemblies = nunit.findTestAssemblies(['test/Data/Solution/Solution.sln']);
        expect(assemblies.length).to.be(1);
        expect(assemblies[0]).to.be(path.normalize('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll'));

    });

    it('should find the assemblies matching your configuration', function() {

        var assemblies = nunit.findTestAssemblies(['test/Data/Solution/Solution.sln'], { config: 'debug' });
        expect(assemblies.length).to.be(1);
        expect(assemblies[0]).to.be(path.normalize('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll'));

    });

    it('should find no assemblies when matching your bad configuration', function() {

        expect(function () {
          nunit.findTestAssemblies(['test/Data/Solution/Solution.sln'], { config: 'release' });
        }).throwError();

    });

});