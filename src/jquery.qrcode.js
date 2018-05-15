(function( $ ){
	$.fn.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		var isIE = function() {
            var b = document.createElement('b');
            b.innerHTML = '<!--[if IE]><i></i><![endif]-->';
            return b.getElementsByTagName('i').length === 1;
        };
        options.render = options.render ||
            (isIE(6) || isIE(7) || isIE(8))? "table": "canvas";

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			render		: "canvas",
			width		: 256,
			height		: 256,
			typeNumber	: -1,
			correctLevel	: QRErrorCorrectLevel.H,
			background      : "#ffffff",
			foreground      : "#000000"
		}, options);

		var createCanvas	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create canvas element
			var canvas	= document.createElement('canvas');
			canvas.width	= options.width;
			canvas.height	= options.height;
			var ctx		= canvas.getContext('2d');

			if( options.src) {
                options.imgWidth = options.imgWidth || options.width / 4.7;
                options.imgHeight = options.imgHeight || options.height / 4.7;
                var img = new Image();
                img.src = options.src;
                img.onload = function () {
                    ctx.drawImage(img, (options.width - options.imgWidth) / 2, (options.height - options.imgHeight) / 2, options.imgWidth, options.imgHeight);
                }
            }

			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the canvas
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){
					ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
					var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
					var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
					ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
				}	
			}
			// return just built canvas
			return canvas;
		}

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();
			
			// create table element
			var $table	= $('<table></table>')
				.css("width", options.width+"px")
				.css("height", options.height+"px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);
		  
			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);
				
				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$('<td></td>')
						.css('width', tileW+"px")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}	
			}

			if( options.src) {
                options.imgWidth = options.imgWidth || options.width / 4.7;
                options.imgHeight = options.imgHeight || options.height / 4.7;
                var $img = $('<img>').attr("src", options.src)
                    .css("width", options.imgWidth)
                    .css("height", options.imgHeight)
                    .css("position", "absolute")
                    .css("left", (options.width - options.imgWidth) / 2)
                    .css("top", (options.height - options.imgHeight) / 2);
                    $table = $('<div style="position:relative;"></div>').append($table).append($img);
            }

			// return just built canvas
			return $table;
		}
  

		return this.each(function(){
			var element	= options.render == "canvas" ? createCanvas() : createTable();
			$(element).appendTo(this);
		});
	};
})( jQuery );
