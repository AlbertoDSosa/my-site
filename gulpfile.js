var gulp = require('gulp'),
		connect = require('gulp-connect'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		browserify =  require('browserify'),
		pug = require('gulp-pug'),
		stringify = require('stringify'),
		source = require('vinyl-source-stream'),
		pugify = require('pugify');

var config = {
	styles: {
		main: './src/styles/main.styl',
		watch: './src/styles/**/*.styl',
		output: './build/css'
	},

	pug: {
		main: './src/index.pug',
		watch: './src/**/*.pug',
		output: './build'
	},

	scripts: {
		main: './src/scripts/main.js',
		watch: ['./src/scripts/**/*.js', './gulpfile.js'],
		output: './build/js'
	},

	fonts: {
		main: './src/assets/icon-fonts/*',
		output: './build/css/icon-fonts'
	},

	codes: './src/scripts/templates/codes/*.txt',
	img: {
		main: './src/assets/images/*',
		output: './build/img'
	}
}

gulp.task('server', ['build'], function () {
	connect.server({
		root: './build',
		livereload: true
	});
});

gulp.task('build:copy', function () {
	gulp.src(config.fonts.main)
  .pipe(gulp.dest(config.fonts.output));
  gulp.src(config.img.main)
  .pipe(gulp.dest(config.img.output));
});

gulp.task('build:scripts', function() {
	return browserify(config.scripts.main)
	.transform(pugify)
	.transform(stringify)
  .bundle()
  .on('error', function (err) { console.log(err); this.emit('end') })
  .pipe(source('main.js'))
  .pipe(gulp.dest(config.scripts.output))
  .pipe(connect.reload())
});


gulp.task('build:css', ['build:copy'], function () {
	gulp.src(config.styles.main)
	.pipe(stylus({
		use: nib(),
		'include css': true
	}))
	.pipe(gulp.dest(config.styles.output))
	.pipe(connect.reload());
});

gulp.task('build:pug', ['build:scripts'], function () {
	gulp.src(config.pug.main)
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest(config.pug.output))
	.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.pug.watch, ['build:scripts', 'build:pug']);
	gulp.watch(config.scripts.watch, ['build:scripts']);
	gulp.watch(config.codes, ['build:scripts']);
});

gulp.task('build', [ 'build:pug', 'build:scripts', 'build:css', 'build:copy']);
gulp.task('default', ['server', 'watch']);