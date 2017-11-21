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
        case "init": for ( var _x in e.data.vars ) if ( e.data.vars.hasOwnProperty( _x ) ) _glob_inline_workers_input_data[ _x ] = e.data.vars[""+_x] ; break ;
        case "run": multithread_treescan_process(); break ;
        case "stop": multithread_treescan_stop(); break ;
        default: break ;
    }
}
function inline_worker_output_member( ret )
{
    document.title = "Progress " + ret.progress + " %" ;
    var _output_channel = ret.out_channel ;
    var _stage = ret.stage ;
    switch ( ret.service.toLowerCase() )
    {
        case "lastpt":
        if ( _stage == 2 )
        {
            var _startpt = ret.startpt ;
            var _word = ret.data ;
                _word = _word.right(1);
            var _lastpt = ret.lastpt ;
            var _drawcolor = ret.drawcolor ;
            var _fillcolor = ret.fillcolor ;
            circles_lib_draw_point( _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm,
                              _lastpt.x, _lastpt.y,
                              YES, _drawcolor, YES, _fillcolor, 1, 2, _glob_opacity, 0 );

            if ( ret.copy )
            {
                 var _is_dupl = circles_lib_figures_find_duplicates( FIGURE_CLASS_POINT, W_PLANE, _lastpt, _glob_storage['figures'] );
                 if ( !_is_dupl )
                 {
                     var _tmp_chunk = [];
                         _tmp_chunk['class'] = FIGURE_CLASS_POINT ;
                         _tmp_chunk['obj'] = _lastpt ;
                         _tmp_chunk['plane'] = W_PLANE ;
                         _tmp_chunk['draw'] = YES ;
                         _tmp_chunk['drawcolor'] = DEFAULT_INTERSECTION_POINT_BORDER_COLOR ;
                         _tmp_chunk['fill'] = YES ;
                         _tmp_chunk['fillcolor'] = DEFAULT_INTERSECTION_POINT_INTERIOR_COLOR ;
                         _tmp_chunk['opacity'] = DEFAULT_MAX_OPACITY ;
                         _tmp_chunk['linewidth'] = 1 ;
                         _tmp_chunk['enabled'] = YES ;
                         _tmp_chunk['myhash'] = "rec" + ( _i + 1 );
                         _tmp_chunk['symbols'] = "" ;
                         _tmp_chunk['propertiesmask'] = 0 ;
                         _glob_storage['figures'].push( _tmp_chunk );
                     if ( is_array( _glob_storage['figures'] ) ) _glob_storage['figures'].push( ret.data );
                 }

            }
        }
        break;
        case "orbit":
        if ( _stage == 2 )
        {
            var _word = ret.data ;
            var _drawcolor = ret.drawcolor ;
            var _fillcolor = ret.fillcolor ;
            if ( _glob_method == METHOD_INVERSION )
            {
                 var _ret_chunk = circles_lib_draw_word_inversion( _glob_wplane_freedraw_layer_placeholder.getContext( _glob_canvas_ctx_2D_mode ), wplane_sm, null, NO, _word, YES, _output_channel );
            }
            else if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) && _word.length > 0 )
            {
                 var _start_x = safe_float( ret.startpt.x, 0 ), _start_y = safe_float( ret.startpt.y, 0 );
                 var _ret_chunk = circles_lib_draw_word_pointwise( _glob_wplane_freedraw_layer_placeholder, wplane_sm, null, NO,
                                                            _word, _start_x, _start_y,
                                                            YES, NO, YES, _drawcolor, _fillcolor, YES, YES, _output_channel );
            }
        }
        break;
        case "region":
        if ( ret._output_channel == OUTPUT_TEXT ) _glob_text += ret.data ;
        if ( ret.copy )
        {
             if ( is_array( _glob_storage['words'] ) )
             {
                  if ( !( _glob_storage['words'].includes( ret.data ) ) )
                  {
                       _glob_storage['words'].push( ret.data );
                       ret.data += " - <greenshock>copied</greenshock>" ;
                  }
             }
        }

        circles_lib_terminal_multicolor_echo( ret.data );
        break;
        case "trace":
        if ( ret._output_channel == OUTPUT_TEXT ) _glob_text += ret.data ;
        if ( ret.copy )
        {
             if ( is_array( _glob_storage['words'] ) )
             {
                  if ( !( _glob_storage['words'].includes( ret.data ) ) )
                  {
                       _glob_storage['words'].push( ret.data );
                       ret.data += " - <greenshock>copied</greenshock>" ;
                  }
             }
        }

        circles_lib_terminal_multicolor_echo( ret.data );
        break;
        default: break ;
    }
}

function inline_worker_end_member( ret )
{
    var _msg = "Passed <snow>" + ret.passed + "</snow> word" + ( ret.passed == 1 ? "" : "s" ) + " over <lightblue>" + ret.found + "</lightblue> processed element" + ( ret.found == 1 ? "" : "s" );
    circles_lib_terminal_multicolor_echo( _msg );
    document.title = _glob_appTITLE + " - " + _glob_appSUBTITLE ;
}