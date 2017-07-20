var _glob_inline_workers_input_data = [] ;
var _glob_inline_worker_run_flag = 0 ;

onmessage = function(e)
{
     switch( e.data.id )
     {
        case "import":
        var _loc = e.data.location ;
        for( var _s = 0 ; _s < e.data.scripts.length ; _s++ ) importScripts( _loc + e.data.scripts[_s] );
        break ;
        case "init":
        for ( var _x in e.data.vars )
        if ( e.data.vars.hasOwnProperty( _x ) ) _glob_inline_workers_input_data[ _x ] = e.data.vars[""+_x] ;
        break ;
        case "run":
        multithread_dict_process();
        break ;
        case "stop":
        multithread_treescan_stop();
        break ;
        default: break ;
     }
}

function inline_worker_output_member( ret )
{
      document.title = "Progress " + ret.progress + " %" ;
      var _output = ret.data.replaceAll( "@", " " );
      if ( ret.out_channel == OUTPUT_TEXT ) _glob_text += _output ;
      if ( ret.copy || ret.dump )
      {
           if ( is_array( _glob_storage['words'] ) )
           {
                if ( !( _glob_storage['words'].includes( ret.data ) ) )
                {
                     var _array = ret.data.includes( "@" ) ? ret.data.split( "@" ) : [];
                     for( var _i = 0 ; _i < _array.length ; _i++ ) _glob_storage['words'].push( _array[_i].trim() );
                     if ( !ret.dump ) _output += " - <greenshock>copied</greenshock>" ;
                }
           }
      }

      if ( ret.display ) circles_lib_terminal_multicolor_echo( _output );
}

function inline_worker_end_member( ret )
{
      circles_lib_output( ret.out_channel, DISPATCH_INFO, "List processed, now wait for final refinements before dumping", 0 );
      _glob_storage['words'].unique();
      _glob_storage['words'].sort( function(a, b){ return a.length - b.length; } );
      var _msg = "Found <snow>" + safe_size( _glob_storage['words'], 0 ) + "</snow> word" + ( ret.found == 1 ? "" : "s" ) + " matching the input filter <snow>" + ret.word_filter + "</snow>" ;
      circles_lib_terminal_multicolor_echo( _msg );
      document.title = _glob_appTITLE + " - " + _glob_appSUBTITLE ;
      if ( safe_size( ret.end_fn, 0 ) > 0 && ret.dump )
      {
          var _end_fn_pointer = eval( ret.end_fn );
          _end_fn_pointer.call( null, ret.dump_params );
      }
}