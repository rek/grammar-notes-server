let gulp = require('gulp'),
	merge = require('merge-stream'),
	plugins = require('gulp-load-plugins')();

gulp.task('js', function() {
	let server = gulp.src('src/**/*.js')
		.pipe(plugins.changed('dist'))
		.pipe(plugins.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'))

	return merge(server);
})

gulp.task('test', ['build'], function() {
	return gulp.src('dist/**/test/*.js')
		.pipe(plugins.mocha({reporter: 'nyan'}))
})

gulp.task('clean', function() {
	let server = gulp.src('dist')
		.pipe(plugins.clean({force: true}))

	return merge(server);
});

gulp.task('default', ['start'], function() {

});

gulp.task('watch', function() {
	// server:
	gulp.watch('src/*.js', ['js']);
	gulp.watch('src/**/*.js', ['js']);
});

gulp.task('nodemon', function() {
	plugins.env({
		file: '.env',
		type: 'ini'
	})

	plugins.nodemon({
		script: 'dist/server.js',
		ext: 'js html',
		delay: 3000,
		watch: [
			'dist/*.js',
			'dist/**/*.js',
		],
		env: {
			'NODE_ENV': 'development'
		}
	})
})

gulp.task('start', ['watch', 'nodemon'], function() {

})

gulp.task('build', ['js'])
