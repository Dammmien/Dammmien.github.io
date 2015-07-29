var image = new Image();

image.onload = loop;

image.src = './images/DSC_7357.jpg';

function loop(){
    var actionItem = actionsList.shift();
    setTimeout( function(  ){
        actionItem.action();
        if( actionsList.length ) loop();
    }, actionItem.time );
}

var actionsList = [
    {
        time: 400,
        action: function(  ){
            document.getElementById( 'index' ).style.opacity = 1;
        }
    }, {
        time: 800,
        action: function(  ){
            document.getElementById( 'name' ).style.opacity = 1;
        }
    }, {
        time: 500,
        action: function(  ){
            document.getElementById( 'name' ).className = 'bordered';
        }
    }, {
        time: 500,
        action: function(  ){
            document.getElementById( 'presentation' ).style.opacity = 1;
        }
    }
];