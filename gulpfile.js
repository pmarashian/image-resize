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
	argumentSizes    = [],

	options = {
		quality: 75
	},

	logs = [];

const chalk = require('chalk');

if( typeof argv.size === 'undefined' ) {

	logs.push( chalk.bold.red( 'No sizes given.  Use "npm run resize -- --size [int]"' ) );

} else {

	if( typeof argv.size == 'number' ) {

		argumentSizes.push( argv.size );

	} else if ( typeof argv.size == 'boolean' ) {

		logs.push( chalk.bold.red( 'No sizes given.  Use "npm run resize -- --size [int]"' ) );

	} else {

		argumentSizes = argv.size;

	}

	argumentSizes.forEach( function( size ) {

		if( typeof size === 'number' ) {

			sizes.push ( size );

		} else {

			logs.push( chalk.bold.red( size + ' is not a valid size' ) );

		}

	});

}

if( typeof argv.quality !== 'undefined' ) {

	if( typeof argv.quality === 'number' ) {

		options.quality = argv.quality;

	}

}

function clean() {

	return del( [ 'build' ] );

}

sizes.forEach( function( size ) {

	logs.push( chalk.bold.red( 'Running resize with size = ' + size ) );

	var resizeImageTask = 'resize_' + size;

	gulp.task( resizeImageTask, function() {

		return gulp

			.src( "src/**/*.{jpg,png,tiff}" )

			.pipe( parallel( imageResize({
				width:  size,
				upscale: false,
				quality: options.quality
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

function log(  cb ) {

	logs.forEach( function( message ) {

		gutil.log( message );

	} );

	cb();

}

var resizeTasks = [ log, clean ];

if( resizeImageTasks.length ) {

	resizeTasks.push( gulp.parallel( resizeImageTasks ) );

}

gulp.task( 'resize', gulp.series( resizeTasks ) );
gulp.task( 'clean', clean );
