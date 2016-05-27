var gulp = require( 'gulp' ),
	imageResize = require( 'gulp-image-resize' ),
	rename = require( 'gulp-rename' ),
	parallel = require( 'concurrent-transform' ),
	del = require( 'del' ),
	minimist = require( 'minimist' ),
	dest = require( 'gulp-dest' );

function clean() {

	return del( [ 'build' ] );

}

function resizeMedium() {

	return gulp
		.src( "src/*.{jpg,png}" )

		.pipe( imageResize({
			width: 500,
			quality: 75
		} ) )

		.pipe( rename( function (path) {

			return path.basename += "-500";

		}))

		.pipe( gulp.dest( 'build/medium' ) );

}

function resizeThumbnail() {

	return gulp
		.src( "src/*.{jpg,png}" )

		.pipe( imageResize({
			width: 150,
			quality: 75
		} ) )

			.pipe( rename( function (path) {

				return path.basename += "-150";

			}))

			.pipe( gulp.dest( 'build/thumbnail' ) );

}

function resize() {

	return gulp
		.src( "src/**/*.{jpg,png}" )

		.pipe( parallel( imageResize({
			width: 500,
			quality: 75
		} ) ) )

		.pipe( rename( function (path) {

			return path.basename += "-500";

		}))

		.pipe( gulp.dest( 'build/medium' ) )

		.pipe( parallel( imageResize({
			width: 150,
			quality: 75
		} ) ) )

		.pipe( rename( function (path) {

			return path.basename += "-150";

		}))

		.pipe( gulp.dest( 'build/thumbnail' ) );

}

var test = gulp.series( clean, gulp.series( resizeMedium, resizeThumbnail ) );

gulp.task( 'resize', gulp.series( clean, resize ) );
gulp.task( 'clean', clean );
gulp.task( 'test', test );
