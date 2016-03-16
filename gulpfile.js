'use strict';

var gulp = require('gulp'),
  gls = require('gulp-live-server'),
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config.js');

var expressSrcFiles = ['lib/**/*.js'];

gulp.task('server', function() {
  var server = gls('.');
  server.start().then(function(result) {
    gutil.log('Server exited with result:', result);
  });
  return gulp.watch(expressSrcFiles, function(file) {
    gutil.log(file);
    server.start.apply(server);
  });
});

var istanbul = require('gulp-istanbul');

gulp.task('test:backend:pre', function() {
    return gulp.src(expressSrcFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test:backend', ['test:backend:pre'], function() {
  return gulp.src('test/server/**/*.js', { read: false })
    .pipe(mocha())
    .on('error', function() { this.emit('end'); })
    .pipe(istanbul.writeReports());
});

gulp.task('watch:test:backend', function() {
    gulp.run('test:backend');
    return gulp.watch(expressSrcFiles.concat(['test/server/**/*.js']), ['test:backend']);
});

gulp.task('test', ['test:backend'], function() {
  process.exit();
});
gulp.task('watch:test', ['watch:test:backend']);

gulp.task('webpack', function(done) {
  webpack(webpackConfig, function() { done() });
});

gulp.task('watch:webpack', ['webpack'], function() {
  return gulp.watch('js/**/*.js', ['webpack']);
});

gulp.task('default', ['server', 'watch:webpack']);
