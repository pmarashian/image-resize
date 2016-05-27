var gulp        = require( 'gulp' ),
	imageResize = require( 'gulp-image-resize' ),
	rename      = require( 'gulp-rename' ),
	parallel    = require( 'concurrent-transform' ),
	del         = require( 'del' ),
	pipes       = require( 'gulp-pipes' ),

	resizeImageTasks = [],

	sizes = [ 75, 150, 300, 450 ];

function clean() {

	return del( [ 'build' ] );

}

sizes.forEach( function( size ) {

	var resizeImageTask = 'resize_' + size;

	gulp.task( resizeImageTask, function() {

		return gulp

			.src( "src/**/*.jpg" )

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

gulp.task( 'resize', gulp.series( clean, gulp.parallel( resizeImageTasks ) ) );
gulp.task( 'clean', clean );
