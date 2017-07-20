(function($){
	$.fn.linenumbers_test = function( _ctrl_id )
	{
			this.get_commented_lines_array = function( _ctrl_id )
			{
					var _ret_array = new Array();
					var _batch_text_box = document.getElementById( _ctrl_id );
					if ( _batch_text_box != null )
					{
							 var _text = _batch_text_box.value ;
							 var _text_array = _text.split( "\n" );
							 var _open = 0 ;
							 
							 for( var _i = 0 ; _i < _text_array.length ; _i++ )
							 {
							 			var _row = _text_array[_i] ;
							 			if ( _row.substr( 0, 2 ) == "//" ) _ret_array.push( ( _i + 1 ) + "" );
							 			else if ( _row.indexOf( "/*" ) != -1 ) _open = 1 ;
		
							 			if ( _open ) _ret_array.push( ( _i + 1 ) + "" );
							 			if ( _row.indexOf( "*/" ) != -1 ) _open = 0 ;
							 }
					}
		
					return _ret_array ;
			}        	

			return this.get_commented_lines_array( _ctrl_id );
	}
	
	$.fn.linenumbers = function(in_opts)
  {
		// Settings and Defaults
		var opt = $.extend(
    {
			id: 'myID',
			col_width: '25px',
			start: 1,
			digits: 3,
      width: '0px',
      height: '0px',
      fontfamily: 'monospace;white-space:pre',
      row_numbers_bkcolor : '#57839F',
      row_numbers_fontcolor : '#97C3DF'
		},
    in_opts);
    
    this.go = function()
    {
        this.each( function( _obj )
        {
    			// Get some numbers sorted out for the CSS changes
          
          var ID = opt.id ;
					var _width = parseInt( opt.width, 10 );       if ( isNaN( _width ) ) _width = 0 ;
          if ( _width == 0 ) _width = parseInt( $(this).css('width'), 10 ) ;
          
          var _css_width = _width + "px" ;
          var new_textarea_width = ( _width - parseInt(opt.col_width) )+'px';
    			// Create the div and the new textarea and style it
    			$(this).before('<div style="width:'+_css_width+';"><div ID=\"linenumbers.'+ID+'\" CLASS=\"linenumberstextarea\" style="width:'+new_textarea_width+';height:'+opt.height+';float:left;overflow:hidden;margin-right:'+'-'+new_textarea_width+';font-family:'+opt.fontfamily+';color:'+opt.row_numbers_fontcolor+';background-color:'+opt.row_numbers_bkcolor+';"></div>');
    			$(this).after('<div style="clear:both;"></div></div>');
    			// Edit the existing textarea's styles
    			$(this).css({'font-family':'monospace','width':new_textarea_width,'float':'right'});
    			// Define a simple variable for the line-numbers box
    			// Bind some actions to all sorts of events that may change it's contents
          var lnbox = $(this).parent().find('div.linenumberstextarea');

              this.writeNumberedLines = function( starting_number )
              {
              			var lnbox = $(this).parent().find('div.linenumberstextarea');
            				// Break apart and regex the lines, everything to spaces sans linebreaks
            				var lines = "\n"+$(this).val();
            				lines = lines.match(/[^\n]*\n[^\n]*/gi);
            				// declare output var
            				var line_number_output='';
            				// declare spacers and max_spacers vars, and set defaults
            				var max_spacers = ''; var spacers = '';
            				for(i=0;i<opt.digits;i++){ max_spacers += ' '; }
            				// Loop through and process each line
            				$.each(lines,function(k,v){
            					// Add a line if not blank
            					if(k!=0){
            						line_number_output += "<br>";
            					}
            					// Determine the appropriate number of leading spaces
            					lencheck = k+opt.start+'!';
            					spacers = max_spacers.substr(lencheck.length-1);
            					// Add the line, trimmed and with out line number, to the output variable
            					line_number_output += spacers+(k+starting_number)+':'+v.replace(/\n/gi,'').replace(/./gi,' ').substr(opt.digits+1);
            				});
            				// Give the text area out modified content.
            				$(lnbox).html(line_number_output);
            				// Change scroll position as they type, makes sure they stay in sync
            			  $(lnbox).scrollTop($(this).scrollTop());
              }
    
    			$(this).bind('change keyup keydown',function()
          {
              this.writeNumberedLines( opt.start ) ;
    			});
    			// Lock scrolling together, for mouse-wheel scrolling
    
    			$(this).scroll(function(){
    			    $(lnbox).scrollTop($(this).scrollTop());
    			});
    			// Fire it off once to get things started
    			$(this).trigger('keyup');
    		});
    }
		
    return this.go();
	};
})(jQuery);