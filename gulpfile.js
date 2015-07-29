var gulp = require( 'gulp' ),
    path = require('path'),
    data = require('gulp-data'),
    jade = require('gulp-jade'),
    less = require( 'gulp-less' ),
    dest = './';

gulp.task('jade', function() {
    gulp.src( './src/pages/*.jade' ).pipe( data( function( file ) {
        try {
            return require('./src/data/' + path.basename( file.path.replace( '.jade', '.json' ) ) );
        } catch( e ){
            return {}
        }
    } ) ).pipe( jade( { pretty: true } ) ).pipe( gulp.dest( dest ) );
    gulp.src( './src/images/*' ).pipe( gulp.dest( dest + 'images' ) );
} );

gulp.task( 'less', function() {
    gulp.src( './src/styles/main.less' ).pipe( less() ).pipe( gulp.dest( dest + 'styles' ) );
} );

gulp.task( 'js', function() {
    gulp.src( './src/js/*' ).pipe( gulp.dest( dest + 'js' ) );
} );

gulp.task( 'watchJade', function() {
    gulp.watch( [
        './src/pages/*.jade',
        './src/data/*.json',
        './src/templates/*.jade'
    ], [ 'jade' ] );
} );

gulp.task( 'watchLess', function() {
    gulp.watch( [
        './src/styles/*.less'
    ], [ 'less' ] );
} );

gulp.task( 'watchJs', function() {
    gulp.watch( [
        './src/js/*'
    ], [ 'js' ] );
} );

gulp.task( 'default', [ 'watchJade', 'watchLess', 'watchJs' ] );