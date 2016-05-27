var gulp = require( 'gulp' ),
	imageResize = require( 'gulp-image-resize' ),
	rename = require( 'gulp-rename' ),
	parallel = require( 'concurrent-transform' ),
	del = require( 'del' ),
	dest = require( 'gulp-dest' ),
	pipes = require( 'gulp-pipes' );

var resizeImageTasks = [];

function clean() {

	return del( [ 'build' ] );

}

[ 150, 500 ].forEach( function( size ) {

	var resizeImageTask = 'resize_' + size;

	gulp.task( resizeImageTask, function() {

		return gulp

			.src( "src/**/*.{jpg,png}" )

			.pipe( parallel( imageResize({
				width:  size,
				upscale: false,
				quality: 75
			}) ) )

			.pipe( pipes.image.optimize() )

			.pipe( dest('build/:name.jpg') )

			.pipe( rename( function( path ){

				path.basename += '-' + size;
				path.dirname += '/' + size;

			} ) )

			.pipe( gulp.dest( './build' ) );
	});

	resizeImageTasks.push(resizeImageTask);
});

gulp.task( 'resize', gulp.series( clean, gulp.parallel( resizeImageTasks ) ) );
gulp.task( 'clean', clean );
