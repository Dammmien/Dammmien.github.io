var SimpleXHR = function( settings ) {

    'use strict';

    var _this = this;

    this.settings = {
        url: '',
        method: 'GET',
        async: true,
        user: '',
        password: '',
        urlParams: {},
        data: null,
        timeout: 0,
        jsonp: false,
        jsonpCallback: "callback",
        onSuccess: function() {},
        onError: function() {},
        onTimeout: function() {}
    };

    this.checkState = function() {
        if ( _this.request.readyState == 4 && _this.request.status == 200 ) {
            _this.settings.onSuccess( _this.request.responseText );
        } else if ( _this.request.readyState === 4 && _this.request.status !== 200 && _this.request.status !== 0 ) {
            _this.settings.onError( _this.request.responseText );
        }
    };

    this.setBeforeSend = function() {
        if ( this.settings.contentType ) {
            this.request.setRequestHeader( 'Content-Type', this.settings.contentType );
        }
        if ( this.settings.overrideMimeType ) {
            this.request.overrideMimeType( this.settings.overrideMimeType );
        }
    };

    this.buildUrlParams = function() {
        var paramsArray = [];
        for ( var param in this.settings.urlParams ) {
            if ( this.settings.urlParams.hasOwnProperty( param ) ) {
                paramsArray.push( param + '=' + this.settings.urlParams[ param ] );
            }
        }
        this.settings.url += '?' + paramsArray.join( '&' );
    };

    this.mixSettings = function() {
        for ( var setting in settings ) {
            if ( settings.hasOwnProperty( setting ) ) {
                this.settings[ setting ] = settings[ setting ];
            }
        }
    };

    this.init = function() {
        this.mixSettings();
        if ( this.settings.jsonp ) {
            this.makeJsonpRequest();
        } else {
            this.makeXMLHttpRequest();
        }
    },

    this.makeJsonpRequest = function() {
        var callback = 'simpleXHR_' + Math.round( Math.random() * 100000000 );
        this.script = document.createElement( 'script' );
        window[ callback ] = function( response ) {
            _this.settings.onSuccess( response );
            _this.script.parentNode.removeChild( _this.script );
            window[ callback ] = undefined;
        };
        this.settings.urlParams[ this.settings.jsonpCallback ] = callback;
        this.buildUrlParams();
        this.script.src = this.settings.url;
    },

    this.makeXMLHttpRequest = function() {
        this.request = new XMLHttpRequest();
        this.request.onreadystatechange = this.checkState;
        this.buildUrlParams();
        this.request.open(
            this.settings.method,
            this.settings.url,
            this.settings.async,
            this.settings.user,
            this.settings.password
        );
        this.request.timeout = this.settings.timeout;
        this.request.ontimeout = function() {
            _this.request.abort();
            _this.settings.onTimeout();
        };
        this.setBeforeSend();
    };

    this.send = function() {
        if ( this.settings.jsonp ) {
            document.body.appendChild( this.script );
        } else {
            this.request.send( this.settings.data );
        }
    };

    this.init();

};