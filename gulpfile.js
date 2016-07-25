var gulp = require('gulp'),
	webServer = require('gulp-webserver'),
	stylus = require('gulp-stylus'),
	nib = require('nib'),
	jadeify = require('jadeify'),
	copy = require('gulp-copy'),
	browserify =  require('browserify'),
	buffer = require('vinyl-buffer'),
	jade = require('gulp-jade'),
	stringify = require('stringify'),
	source = require('vinyl-source-stream');

var config = {
	styles: {
		main: './src/styles/main.styl',
		watch: './src/styles/**/*.styl',
		output: './build/css'
	},

	jade: {
		main: './src/index.jade',
		watch: './src/**/*jade',
		output: './build'
	},

	scripts: {
		main: './src/scripts/main.js',
		watch: ['./src/scripts/**/*.js', './gulpfile.js'],
		output: './build/js'
	},

	vendor: {
		main: './src/scripts/vendor/**/*.js',
		output: './build/js/vendor'
	}
}

gulp.task('server', function () {
	gulp.src('./build')
	.pipe(webServer({
		host: '0.0.0.0',
		port: 8080,
		livereload: true,
      	open: true
	}));
});

gulp.task('build:copy', function () {
	gulp.src(config.vendor.main)
  .pipe(gulp.dest(config.vendor.output));
});

gulp.task('build:scripts', function() {
	return browserify({
    entries: config.scripts.main,
    transform: [jadeify, stringify,]
  })
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest(config.scripts.output))
});

gulp.task('build:css', function () {
	gulp.src(config.styles.main)
	.pipe(stylus({
		use: nib(),
		'include css': true
	}))
	.pipe(gulp.dest(config.styles.output));
});

gulp.task('build:jade', function () {
	gulp.src(config.jade.main)
	.pipe(jade())
	.pipe(gulp.dest(config.jade.output));
});

gulp.task('watch', function () {
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.jade.watch, ['build:jade', 'build:scripts']);
	gulp.watch(config.scripts.watch, ['build:scripts']);
});

gulp.task('build', ['build:css', 'build:jade', 'build:scripts', 'build:copy']);
gulp.task('default', ['server', 'build', 'watch']);