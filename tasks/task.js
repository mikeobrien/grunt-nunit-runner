var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('nunit', 'Runs the NUnit test runner.', function() {
        var options = this.options({});
        console.log('oh hai');
    });
};
