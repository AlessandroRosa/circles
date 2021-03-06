function CIRCLESformsBENCHMARKclose() { return circles_lib_plugin_dispatcher_unicast_message( "benchmark", "forms", POPUP_DISPATCHER_UNICAST_EVENT_CLOSE ); }
function CIRCLESformsBENCHMARKmain( _base_id, _move )
{
     CIRCLESformsBENCHMARKbaseid = safe_string( _base_id, "" ).trim() ;
	var _this_fn_name = "CIRCLESformsBENCHMARKmain" ;
     _move = safe_int( _move, YES );
     var _start_date = new Date( _glob_benchmark_start_microtime * 1000 );
     var _start_hh = _start_date.getHours();
         if ( _start_hh < 10 ) _start_hh = "0" + _start_hh ;
     var _start_mm = _start_date.getMinutes();
         if ( _start_mm < 10 ) _start_mm = "0" + _start_mm ;
     var _start_ss = _start_date.getSeconds();
         if ( _start_ss < 10 ) _start_ss = "0" + _start_ss ;
     var _end_date = new Date( _glob_benchmark_end_microtime * 1000 );
     var _end_hh = _end_date.getHours();
         if ( _end_hh < 10 ) _end_hh = "0" + _end_hh ;
     var _end_mm = _end_date.getMinutes();
         if ( _end_mm < 10 ) _end_mm = "0" + _end_mm ;
     var _end_ss = _end_date.getSeconds();
         if ( _end_ss < 10 ) _end_ss = "0" + _end_ss ;

     var WIDTH = 350, HEIGHT = "auto", _subset = "forms" ;
     var CLOSE_FN = "CIRCLESformsBENCHMARKclose()" ;
     var _div_id = CIRCLESformsBENCHMARKdiv_id = circles_lib_plugin_build_divid( _subset, _base_id );
     var HTMLcode =  "<table WIDTH=\""+WIDTH+"\">" ;
         HTMLcode += circles_lib_plugin_caption_code( YES, CIRCLESformsBENCHMARKcaption, 5, YES, CLOSE_FN, WIDTH, HEIGHT, _this_fn_name, _base_id, _div_id, _subset, "clock/clock.20x20.png" );
         HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
         if ( _glob_benchmark_operations > 0 )
         {
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Benchmark of the last process</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Operations</td><td WIDTH=\"5\"></td><td>"+_glob_benchmark_operations+"</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Start at</td><td WIDTH=\"5\"></td><td>"+( _start_hh + ":" + _start_mm + ":" + _start_ss )+"</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td>End at</td><td WIDTH=\"5\"></td><td>"+( _end_hh + ":" + _end_mm + ":" + _end_ss )+"</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
              
             var _duration = _glob_benchmark_end_microtime - _glob_benchmark_start_microtime ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td>Duration</td><td WIDTH=\"5\"></td><td>"+_duration.toFixed(3)+" secs</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"12\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"3\" CLASS=\"link_rounded\" ONCLICK=\"javascript:CIRCLESformsBENCHMARKtableSAVE();\">Export</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
         }
         else
         {
             HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
             HTMLcode += "<tr><td WIDTH=\"5\"></td><td ALIGN=\"center\" STYLE=\"font-size:14pt;color:"+get_rgb_from_color_tag( "gray" )+";\">No process was run yet</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"24\"></td></tr>" ;
         }

     HTMLcode += "</table>" ;
     HTMLcode = HTMLcode.replaceAll( "%imgpath%", _glob_path_to_img );
                     
     GLOB_PLUGIN_BASE_ID = _base_id, GLOB_PLUGIN_SUBSET = _subset ;
     if ( _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] == null ) _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET] = [] ;
     _plugin_tmp_vars_array[GLOB_PLUGIN_SUBSET][GLOB_PLUGIN_BASE_ID] = _div_id ;

     var _div = circles_lib_plugin_create( _div_id, WIDTH, HEIGHT, HTMLcode );
     circles_lib_plugin_activate( NO, _base_id, _this_fn_name, arguments, _subset, OPEN, _div_id, CIRCLESformsBENCHMARKcaption, CLOSE_FN );
     if ( _move && _div != null ) move_div( _div.id, "LEFT", "TOP" );
}

function CIRCLESformsBENCHMARKtableSAVE()
{
		switch( _ret_chunk[0] )
		{
				case YES:
        var _start_date = new Date( _glob_benchmark_start_microtime * 1000 );
        var _start_hh = _start_date.getHours();
            if ( _start_hh < 10 ) _start_hh = "0" + _start_hh ;
        var _start_mm = _start_date.getMinutes();
            if ( _start_mm < 10 ) _start_mm = "0" + _start_mm ;
        var _start_ss = _start_date.getSeconds();
            if ( _start_ss < 10 ) _start_ss = "0" + _start_ss ;
        var _end_date = new Date( _glob_benchmark_end_microtime * 1000 );
        var _end_hh = _end_date.getHours();
            if ( _end_hh < 10 ) _end_hh = "0" + _end_hh ;
        var _end_mm = _end_date.getMinutes();
            if ( _end_mm < 10 ) _end_mm = "0" + _end_mm ;
        var _end_ss = _end_date.getSeconds();
            if ( _end_ss < 10 ) _end_ss = "0" + _end_ss ;
				var _out_array = [] ;
						_out_array.push( _glob_app_title, _glob_app_subtitle, "", "Benchmark" );
						_out_array.push( "Operations : " + _glob_benchmark_operations );
						_out_array.push( "Start time : " + _start_hh+":"+_start_mm+":"+_start_ss );
						_out_array.push( "End time : " + _end_hh+":"+_end_mm+":"+_end_ss );
        var _duration = _glob_benchmark_end_microtime - _glob_benchmark_start_microtime ;
						_out_array.push( "Duration : " + _duration.toFixed(3) + " secs" );

				var _filename = "circles.benchmark.txt" ;
				var blob = new Blob( [ _out_array.join( _glob_crlf ) ], { type: 'plain/text', endings: 'native' });
			  saveAs( blob, _filename );
				break ;
        default:
        CIRCLESformsAUTOMATONtableCHECKprocessOUTPUT( _ret_chunk ) ;
        break ;
		}
}