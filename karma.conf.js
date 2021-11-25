// Karma configuration
// Generated on Thu May 21 2015 09:01:47 GMT+1000 (AEST)

module.exports = function (config) {

    var sourcePreprocessors = ['coverage'];
    var reporters = ['progress', 'coverage'];

    function isDebug(argument) {
        return argument === '--debug';
    }
    if (process.argv.some(isDebug)) {
        sourcePreprocessors = [];
        reporters = ['progress'];
    }
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        plugins: ['@metahub/karma-jasmine-jquery', 'karma-*'],


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jquery-3.3.1',
            'jasmine-jquery',
            'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'src/test/js/util/*.js',
            'grails-app/assets/vendor-ext/knockout/knockout-latest.js',
            'grails-app/assets/vendor-ext/knockout-mapping/knockout.mapping.js',
            'grails-app/assets/vendor/jquery.validationEngine/3.1.0/jquery.validationEngine.js',
            'grails-app/assets/vendor-ext/underscore/underscore.js',
            'grails-app/assets/vendor/wmd/showdown.js',
            'grails-app/assets/vendor/wmd/wmd.js',
            'grails-app/assets/vendor-ext/datatables.net/js/jquery.dataTables.js',
            'grails-app/assets/vendor-ext/jquery-appear-original/index.js',
            'grails-app/assets/vendor/amplifyjs/amplify.min.js',
            'grails-app/assets/vendor-ext/frigus02-vkbeautify/vkbeautify.js',
            'grails-app/assets/vendor-ext/bootstrap/js/bootstrap.bundle.js',
            "node_modules/moment/moment.js",
            "node_modules/moment-timezone/builds/moment-timezone-with-data.js",
            'grails-app/assets/javascripts/*.js',
            'grails-app/assets/components/components.js',
            'grails-app/assets/components/compile/*.js',
            'grails-app/assets/components/javascript/*.js',
            'src/test/js/spec/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'grails-app/assets/javascripts/*.js':sourcePreprocessors
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: reporters,

        coverageReporter: {
            'dir':'./target',
            'type':"text",
            check: {
                global: {
                    lines: 33.2
                }
            }
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome','Firefox','ChromeHeadless'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
