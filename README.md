# grunt-nunit-runner [![Build Status](https://api.travis-ci.org/mikeobrien/grunt-nunit-runner.png?branch=master)](https://travis-ci.org/mikeobrien/grunt-nunit-runner) [![NPM version](https://badge.fury.io/js/grunt-nunit-runner.png)](https://npmjs.org/package/grunt-nunit-runner)
Grunt plugin for running [NUnit](http://www.nunit.org/).
NOTE: this plugin requires Grunt 0.4.x.

## Getting Started
From the same directory as your project's Gruntfile and package.json, install
this plugin with the following command:

```bash
$ npm install grunt-nunit-runner --save-dev
```

Next add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-nunit-runner');
```

## Config
Inside your `Gruntfile.js` file, add a section named `nunit`, containing
assembly information:

```js
nunit: {
    options: {
        
    }
}
```

## License
MIT License