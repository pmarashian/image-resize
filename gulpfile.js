var gulp        = require( 'gulp' ),
	imageResize = require( 'gulp-image-resize' ),
	rename      = require( 'gulp-rename' ),
	parallel    = require( 'concurrent-transform' ),
	del         = require( 'del' ),
	pipes       = require( 'gulp-pipes' ),
	gutil       = require( 'gulp-util' ),
	minimist    = require( 'minimist' ),

	argv             = minimist( process.argv.slice(2) ),
	resizeImageTasks = [],
	sizes            = [],
	argumentSizes    = [];

const chalk = require('chalk');

if( typeof argv.size === 'undefined' ) {

	gutil.log( chalk.bold.red( 'No sizes given.  Use "npm run resize -- --size [int]"' ) );

} else {

	if( typeof argv.size == 'number' ) {

		argumentSizes.push( argv.size );

	} else {

		argumentSizes = argv.size;

	}

	argumentSizes.forEach( function( size ) {

		if( typeof size === 'number' ) {

			sizes.push ( size );

		} else {

			gutil.log( chalk.bold.red( size + ' is not a valid size' ) );

		}

	});

}

function clean() {

	return del( [ 'build' ] );

}

sizes.forEach( function( size ) {

	var resizeImageTask = 'resize_' + size;

	gulp.task( resizeImageTask, function() {

		return gulp

			.src( "src/**/*.{jpg,png,tiff}" )

			.pipe( parallel( imageResize({
				width:  size,
				upscale: false,
				quality: 75
			}) ) )

			.pipe( pipes.image.optimize() )

			.pipe( rename( function( path ){

				path.basename += '-' + size;
				path.dirname = '../build/' + size;

			} ) )

			.pipe( gulp.dest( './build' ) );

	});

	resizeImageTasks.push( resizeImageTask );

});

var resizeTasks = [ clean ];

if( resizeImageTasks.length ) {

	resizeTasks.push( gulp.parallel( resizeImageTasks ) );

}

gulp.task( 'resize', gulp.series( resizeTasks ) );
gulp.task( 'clean', clean );
