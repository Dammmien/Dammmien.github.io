var fs = require( 'fs' );
var markdown = require( 'markdown' ).markdown;
var jade = require('jade');

function build( path ) {

    var today = new Date();

    var files = fs.readdirSync( __dirname + '/articles' );
    var htmlFiles = '';
    var existingArticles = fs.readFileSync( __dirname + '/articles.json', {
        encoding: 'utf8'
    });

    existingArticles = JSON.parse(existingArticles);

    for( var i = 0; i < files.length; i++){
        var file = fs.readFileSync( __dirname + '/articles/' + files[i], {
            encoding: 'utf8'
        });
        if( !existingArticles.hasOwnProperty( files[i] ) ){
            existingArticles[ files[i] ] = {
                date: today.getFullYear() + '-' + ( today.getMonth() + 1 ) + '-' + today.getDate()
            }
        }
        htmlFiles += markdown.toHTML( file );
    }

    console.log( existingArticles )

    var indexHTML = jade.renderFile(__dirname + '/index.jade', {pageData: {content : htmlFiles}});

    fs.writeFileSync( 'articles.json', JSON.stringify( existingArticles ), 'utf8' );
    fs.writeFileSync( 'index.html', indexHTML, 'utf8' );

}

build();