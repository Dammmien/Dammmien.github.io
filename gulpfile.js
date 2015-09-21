var path = require( 'path' ),
    gulp = require( 'gulp' ),
    data = require( 'gulp-data' ),
    jade = require( 'gulp-jade' ),
    less = require( 'gulp-less' ),
    minifyCss = require( 'gulp-minify-css' ),
    uglify = require( 'gulp-uglify' ),
    rm = require( 'gulp-rimraf' ),
    config = require( './config.json' ),
    cleanFolder = function( folder ) {
        return gulp.src( './' + config.output + folder ).pipe( rm() );
    };


/* * * CSS TASKS * * */

gulp.task( '_reloadCss', [ '_less' ] ).task( '_less', [ '_cleanCss' ], function() {
    return gulp.src( './src/styles/main.less' ).pipe( less() ).on( 'error', console.log ).pipe( minifyCss( config.cssOptions ) ).pipe( gulp.dest( './' + config.output + '/styles' ) );
} ).task( '_cleanCss', cleanFolder.bind( this, '/styles' ) );


/* * * JS TASKS * * */

gulp.task( '_reloadJs', [ '_js' ] ).task( '_js', [ '_cleanJs' ], function() {
    return gulp.src( './src/js/*' ).pipe( uglify( config.jsOptions ) ).pipe( gulp.dest( './' + config.output + '/js' ) );
} ).task( '_cleanJs', cleanFolder.bind( this, '/js' ) );


/* * * ASSETS TASKS * * */

gulp.task( '_reloadAssets', [ '_assets' ] ).task( '_assets', [ '_cleanAssets' ], function() {
    return gulp.src( './src/assets/**/*' ).pipe( gulp.dest( './' + config.output + '/assets' ) );
} ).task( '_cleanAssets', cleanFolder.bind( this, '/assets' ) );

/* * * HTML TASKS * * */

gulp.task( '_reloadHtml', [ '_jade' ] ).task( '_jade', [ '_cleanHtml' ], function() {
    return gulp.src( './src/pages/*.jade' ).pipe( data( function( file ) {
        try {
            return require( './src/data/' + path.basename( file.path.replace( '.jade', '.json' ) ) );
        } catch ( e ) {
            return {};
        }
    } ) ).pipe( jade( {
        pretty: config.prettifyHTML
    } ) ).pipe( gulp.dest( './' + config.output + '/' ) );
} ).task( '_cleanHtml', cleanFolder.bind( this, '/*.html' ) );


/* * * PUBLIC TASKS * * */

gulp.task( 'build', [
    '_jade',
    '_less',
    '_js',
    '_assets'
] ).task( 'default', function() {
    gulp.watch( [ './src/assets/**/*' ], [ '_reloadAssets' ] );
    gulp.watch( [ './src/pages/*.jade', './src/templates/*.jade', './src/data/*.json' ], [ '_reloadHtml' ] );
    gulp.watch( [ './src/styles/*.less' ], [ '_reloadCss' ] );
    gulp.watch( [ './src/js/*' ], [ '_reloadJs' ] );
} );