var gulp = require('gulp'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less');

gulp.task('jshint', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('js', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('less', function () {
    gulp.src('./src/css/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('default', ['jshint'], function() {
    gulp.watch('./src/*.html', function() {
        gulp.run('htmlpage');
    });

    gulp.watch('./src/js/*.js', function() {
        gulp.run('jshint', 'js');
    });

    gulp.watch('./src/css/**/*.less', function() {
        gulp.run('less');
    });
});