const gulp = require('gulp'),
		connect = require('gulp-connect'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		browserify =  require('browserify'),
		pug = require('gulp-pug'),
		stringify = require('stringify'),
		source = require('vinyl-source-stream'),
		pugify = require('pugify'),
		uglify = require('gulp-uglify'),
		pump = require('pump');

const config = {
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

// Tareas para desarrollo.

gulp.task('server', ['build:scripts'], function () {
	connect.server({
		root: './build',
		livereload: true
	});
});

gulp.task('build:copy', ['build:scripts'], function () {
	gulp.src(config.fonts.main)
  .pipe(gulp.dest(config.fonts.output));
  gulp.src(config.img.main)
  .pipe(gulp.dest(config.img.output));
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

gulp.task('watch', ['build'], function () {
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.pug.watch, ['build:scripts', 'build:pug']);
	gulp.watch(config.scripts.watch, ['build:scripts']);
	gulp.watch(config.codes, ['build:scripts']);
});

// Tareas de empaquetado para producción

const compile = {
	styles: {
		main: './src/styles/main.styl',
		output: './dist/css'
	},

	pug: {
		main: './src/index.pug',
		output: './dist'
	},

	scripts: {
		main: './build/js/main.js',
		output: './dist/js'
	},

	fonts: {
		main: './src/assets/icon-fonts/*',
		output: './dist/css/icon-fonts'
	},
	img: {
		main: './src/assets/images/*',
		output: './dist/img'
	}
}

gulp.task('compile:copy', function () {
	gulp.src(compile.fonts.main)
  .pipe(gulp.dest(compile.fonts.output));
  gulp.src(compile.img.main)
  .pipe(gulp.dest(compile.img.output));
});

gulp.task('compress:scripts', function (cb) {
	pump([
        gulp.src(compile.scripts.main),
        uglify(),
        gulp.dest(compile.scripts.output)
    ],
    cb
  );
})


gulp.task('compile:css', ['compress:scripts', 'compile:copy'], function () {
	gulp.src(compile.styles.main)
	.pipe(stylus({
		use: nib(),
		'include css': true,
		compress: true
	}))
	.pipe(gulp.dest(compile.styles.output));
});

gulp.task('compile:pug', function () {
	gulp.src(compile.pug.main)
	.pipe(pug({pretty: false}))
	.pipe(gulp.dest(compile.pug.output));
});

gulp.task('production', ['compile'], function () {
	connect.server({
		root: './dist'
	});
});

gulp.task('compile', ['compile:pug', 'compress:scripts', 'compile:css', 'compile:copy'])
gulp.task('build', [ 'build:scripts','build:pug', 'build:css', 'build:copy']);
gulp.task('default', ['server', 'watch']);