var gulp = require('gulp'),
  gls = require('gulp-live-server'),
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util'),
  webpack = require('webpack');

var expressSrcFiles = ['lib/**/*.js'],
    testFiles = ['test/**/*.js'];

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

var mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

gulp.task('test:backend:pre', function() {
    return gulp.src(expressSrcFiles)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test:backend', ['test:backend:pre'], function() {
    return gulp.src('test/server/**/*.js', { read: false })
        .pipe(mocha())
        .pipe(istanbul.writeReports());
});

gulp.task('watch:test:backend', function() {
    gulp.run('test:backend');
    return gulp.watch(expressSrcFiles.concat(['test/server/**/*.js']), ['test:backend']);
});

gulp.task('default', ['server']);
