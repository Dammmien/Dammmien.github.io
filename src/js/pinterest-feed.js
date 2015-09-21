var PinterestFeed = function( options ) {

    this.init = function() {
        this.pins = [];
        this.pinsContainers = [];
        this.boards = options.boards;
        this.initialBoardsLength = this.boards.length;
        this.createContainers();
        this.getPins();
    };

    this.createContainers = function() {
        this.pinsWidth = window.innerWidth < 1000 ? '20' : '10';
        this.pinsHeight = window.innerWidth / 100 * this.pinsWidth;
        for ( var i = 0; i < 1250; i++ ) {
            var div = document.createElement( 'div' );
            div.className = 'img-container';
            div.style.width = this.pinsWidth + '%';
            div.style.height = this.pinsHeight + 'px';
            document.getElementById( 'content' ).appendChild( div );
            this.pinsContainers.push( div );
        };
    };

    this.getPins = function() {
        var board = this.boards.shift();
        var request = new SimpleXHR( {
            url: 'https://api.pinterest.com/v3/pidgets/boards/dammien/' + board + '/pins',
            jsonp: true,
            method: 'GET',
            onSuccess: function( resp ) {
                this.addPins( resp.data.pins );
                if ( this.boards.length ) this.getPins();
            }.bind( this )
        } );
        request.send();
    };

    this.pinIsLight = function( hexcolor ) {
        if ( !hexcolor ) return true;
        var r = parseInt( hexcolor.substr( 1, 2 ), 16 );
        var g = parseInt( hexcolor.substr( 3, 2 ), 16 );
        var b = parseInt( hexcolor.substr( 5, 2 ), 16 );
        var yiq = ( ( r * 299 ) + ( g * 587 ) + ( b * 114 ) ) / 1000;
        return yiq >= 128;
    };

    this.buildLink = function( pin ) {
        var link = document.createElement( 'a' ),
            img = this.pinIsLight( pin.dominant_color ) ? 'assets/images/eye-black.png' : 'assets/images/eye-white.png';
        link.href = 'http://www.pinterest.com/pin/' + pin.id;
        link.target = '_blank';
        link.style[ 'background-image' ] = 'url(' + img + ')';
        link.style[ 'background-color' ] = pin.dominant_color;
        return link;
    }

    this.addPins = function( pins ) {
        var pin = pins.shift(),
            maxLength = this.pinsContainers.length > 150 ? 150 : this.pinsContainers.length,
            index = Math.floor( Math.random() * maxLength ),
            container = this.pinsContainers.splice( index, 1 )[ 0 ],
            src = pin.images[ '237x' ].url,
            image = new Image();

        image.onload = function(){
            container.style[ 'background-image' ] = 'url(' + src + ')';
            container.appendChild( this.buildLink( pin ) );
        }.bind( this );

        image.src = src;

        setTimeout( function() {
            if ( pins.length ) this.addPins( pins );
        }.bind( this ), 100 );
    };

};

var feed = new PinterestFeed( {
    boards: [
        'logos',
        'letterpress',
        'graphic-design',
        'product-design',
        'board-design',
        'webdesign-fullscreen',
        'webdesign-minimal',
        'webdesign-blog',
        'webdesign-one-page',
        'webdesign-ui-details',
        'webdesign-e-commerce',
        'wish-list',
        'old-cars',
        'board-culture',
        'branding',
        'the-place-to-be',
        'mobile-tablet',
        'men-style',
        'interior-design-loft',
        'interior-design-minimalist',
        'interior-design-workspace',
        'interior-design-industrial',
        'webdesign-application-interfaces',
        'lifestyle',
        'friendship-funny-time'
    ]
} );

feed.init();