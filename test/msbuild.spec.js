var expect = require('expect.js'),
    msbuild = require('../tasks/msbuild.js');

describe('msbuild', function() {

    it('should enumerate solution projects', function() {

        var projects = msbuild.getSolutionProjects('test/Data/Solution/Solution.sln');
        expect(projects.length).to.be(3);
        expect(projects[0]).to.be('test/Data/Solution/Project.ClassLibrary.csproj');
        expect(projects[1]).to.be('test/Data/Solution/Project.WebApplication/Project.WebApplication.csproj');
        expect(projects[2]).to.be('test/Data/Project.WpfApplication/Project.WpfApplication.csproj');
        
    });

    it('should enumerate project info', function() {

        var info = msbuild.getProjectInfo('test/Data/Project.WpfApplication/Project.WpfApplication.csproj', 'AssemblyInfo.cs');

        expect(info.output.length).to.be(2);

        expect(info.output[0]).to.be('test/Data/Project.WpfApplication/bin/Debug/Project.WpfApplication.exe');
        expect(info.output[1]).to.be('test/Data/Project.WpfApplication/bin/Release/Project.WpfApplication.exe');

        expect(info.references.length).to.be(11);
        expect(info.references[0]).to.be('System');
        expect(info.references[1]).to.be('System.Data');
        expect(info.references[2]).to.be('System.Xml');
        expect(info.references[3]).to.be('Microsoft.CSharp');
        expect(info.references[4]).to.be('System.Core');
        expect(info.references[5]).to.be('System.Xml.Linq');
        expect(info.references[6]).to.be('System.Data.DataSetExtensions');
        expect(info.references[7]).to.be('System.Xaml');
        expect(info.references[8]).to.be('WindowsBase');
        expect(info.references[9]).to.be('PresentationCore');
        expect(info.references[10]).to.be('PresentationFramework');
        
    });

    it('should enumerate solution project info', function() {

        var infos = msbuild.getSolutionProjectInfo('test/Data/Solution/Solution.sln');

        expect(infos.length).to.be(3);
        
        var info = infos[0];

        expect(info.output.length).to.be(2);
        expect(info.output[0]).to.be('test/Data/Solution/bin/Debug/Project.ClassLibrary.dll');
        expect(info.output[1]).to.be('test/Data/Solution/bin/Release/Project.ClassLibrary.dll');

        expect(info.references.length).to.be(10);
        expect(info.references[0]).to.be('NSubstitute');
        expect(info.references[1]).to.be('nunit.framework');
        expect(info.references[2]).to.be('Should');
        expect(info.references[3]).to.be('System');
        expect(info.references[4]).to.be('System.Core');
        expect(info.references[5]).to.be('System.Xml.Linq');
        expect(info.references[6]).to.be('System.Data.DataSetExtensions');
        expect(info.references[7]).to.be('Microsoft.CSharp');
        expect(info.references[8]).to.be('System.Data');
        expect(info.references[9]).to.be('System.Xml');
        
        info = infos[1];

        expect(info.output.length).to.be(1);
        expect(info.output[0]).to.be('test/Data/Solution/Project.WebApplication/bin/Project.WebApplication.dll');

        expect(info.references.length).to.be(36);
        expect(info.references[0]).to.be('Bottles');
        expect(info.references[1]).to.be('FubuCore');
        expect(info.references[2]).to.be('FubuLocalization');
        expect(info.references[3]).to.be('FubuMVC.Core');
        expect(info.references[4]).to.be('FubuMVC.Core.Assets');
        expect(info.references[5]).to.be('FubuMVC.Core.UI');
        expect(info.references[6]).to.be('FubuMVC.Core.View');
        expect(info.references[7]).to.be('FubuMVC.Diagnostics');
        expect(info.references[8]).to.be('FubuMVC.JQueryUI');
        expect(info.references[9]).to.be('FubuMVC.Navigation');
        expect(info.references[10]).to.be('FubuMVC.RegexUrlPolicy');
        expect(info.references[11]).to.be('FubuMVC.Spark');
        expect(info.references[12]).to.be('FubuMVC.StructureMap');
        expect(info.references[13]).to.be('FubuMVC.TwitterBootstrap');
        expect(info.references[14]).to.be('HtmlTags');
        expect(info.references[15]).to.be('Microsoft.CSharp');
        expect(info.references[16]).to.be('Microsoft.Web.Infrastructure, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL');
        expect(info.references[17]).to.be('Spark');
        expect(info.references[18]).to.be('StructureMap');
        expect(info.references[19]).to.be('System.Web.DynamicData');
        expect(info.references[20]).to.be('System.Web.Entity');
        expect(info.references[21]).to.be('System.Web.ApplicationServices');
        expect(info.references[22]).to.be('System.ComponentModel.DataAnnotations');
        expect(info.references[23]).to.be('System');
        expect(info.references[24]).to.be('System.Data');
        expect(info.references[25]).to.be('System.Core');
        expect(info.references[26]).to.be('System.Data.DataSetExtensions');
        expect(info.references[27]).to.be('System.Web.Extensions');
        expect(info.references[28]).to.be('System.Xml.Linq');
        expect(info.references[29]).to.be('System.Drawing');
        expect(info.references[30]).to.be('System.Web');
        expect(info.references[31]).to.be('System.Xml');
        expect(info.references[32]).to.be('System.Configuration');
        expect(info.references[33]).to.be('System.Web.Services');
        expect(info.references[34]).to.be('System.EnterpriseServices');
        expect(info.references[35]).to.be('WebActivatorEx');
        
        info = infos[2];

        expect(info.output.length).to.be(2);
        expect(info.output[0]).to.be('test/Data/Project.WpfApplication/bin/Debug/Project.WpfApplication.exe');
        expect(info.output[1]).to.be('test/Data/Project.WpfApplication/bin/Release/Project.WpfApplication.exe');

        expect(info.references.length).to.be(11);
        expect(info.references[0]).to.be('System');
        expect(info.references[1]).to.be('System.Data');
        expect(info.references[2]).to.be('System.Xml');
        expect(info.references[3]).to.be('Microsoft.CSharp');
        expect(info.references[4]).to.be('System.Core');
        expect(info.references[5]).to.be('System.Xml.Linq');
        expect(info.references[6]).to.be('System.Data.DataSetExtensions');
        expect(info.references[7]).to.be('System.Xaml');
        expect(info.references[8]).to.be('WindowsBase');
        expect(info.references[9]).to.be('PresentationCore');
        expect(info.references[10]).to.be('PresentationFramework');
        
    });

});