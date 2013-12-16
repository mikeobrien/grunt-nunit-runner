var expect = require('expect.js'),
    sinon = require('sinon'),
    _ = require('underscore'),
    fs = require('fs'),
    temp = require('temp');

function runTask(options) {
    var grunt = { registerTask: sinon.spy() };
    task(grunt);
    var context = { options: function(defaults) { return _.extend(options, defaults); } };
    grunt.registerTask.firstCall.args[2].apply(context);
}

describe('task', function(){

    var data;
    var attribute = '[assembly: AssemblyTitle("This is the title")]';

    beforeEach(function() {
        temp.track();
        data = temp.mkdirSync() + '/Data/';
    });

    afterEach(function() {
        temp.cleanup();
    });

    it('should', function() {

        console.log('oh hai');

    });

});