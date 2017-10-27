var _ret_style = "" ;
var _start_comment = 0, _end_comment = 0, _oneline_comment = 0, _multiline_comment = 0 ;
var _last_string = "" ;
var _last_keycode = 0 ;
var _prev_char, _curr_char, _next_char ;

function _comment_encloser()
{
    this.type = UNDET ; /* 1: one-line comment, 2: multi-line comment */
    this.start_row = UNDET ;
    this.start_col = UNDET ;
    this.end_row = UNDET ;
    this.end_col = UNDET ;
} ;
                      
var _comments_array = [] ;

function _comment_encloser_remove( _index )
{
    _index = _index < 0 ? UNDET : safe_int( _index, UNDET );
    if ( _index > UNDET && _index < _comments_array.length )
    {
        var _old_size = safe_size( _comments_array, 0 );
        _comments_array.remove( _index, _index );
        var _new_size = safe_size( _comments_array, 0 );
        return _new_size == ( _old_size - 1 ) ? 1 : 0 ;
    }
    else return NO ;
}

function _comment_encloser_create( _row, _col, _type )
{
    var _comment = new _comment_encloser() ;
    _comment.start_row = _comment.end_row = _row, _comment.start_col = _col, _comment.end_col = _col, _comment.type = _type ;
    _comments_array.push( _comment );
    return _comments_array.length - 1 ;
}

function _comment_encloser_close( _row, _col, _index )
{
    if ( _comments_array[ _index ] instanceof _comment_encloser )
    {
        _comment.end_row = _row, _comment.end_col = _col ;
        return YES ;
    }
    else return NO ;
}

function _comment_encloser_shift_one_row( _row )
{
    var _shifted_n = 0, _shift_flag = 0 ;
    $.each( _comments_array,
            function( _i, _encloser_chunk )
            {
                 _shift_flag = 0 ;
                 if ( _encloser_chunk.start_row >= _row )
                 {
                    _comments_array[_i].start_row++ ;
                    _shift_flag = 1 ;
                 }
                 if ( _encloser_chunk.end_row >= _row )
                 {
                    _comments_array[_i].end_row++ ;
                    _shift_flag = 1 ;
                 }
                 
                 if ( _shift_flag ) _shifted_n++ ;
            }
          ) ;
          
     return _shifted_n ;
}

function _comment_encloser_find_index( _row, _col )
{
    var _found_index = UNFOUND, _row = safe_int( _row, UNDET ), _col = safe_int( _col, UNDET ) ;
    if ( safe_size( _comments_array, 0 ) > 0 )
    $.each( _comments_array,
            function( _i, _chunk )
            {
                if ( _chunk.start_row >=0 && _row >= _chunk.start_row && _col >= _chunk.start_col &&
                     _chunk.end_row >=0 && _row <= _chunk.end_row && _col <= _chunk.end_col )
                {
                     _found_index = _i ;
                     return false ;
                }
            }
          ) ;
    return _found_index ;
}

function codemirror_CommentsHandler( stream, state )
{
    var _style = "" ,
		_prev_char = stream.myprev_char();
    _curr_char = stream.mycurr_char();
  	_next_char = stream.mynext_char();
    if ( ( _prev_char + _curr_char ) == "//" ) { _oneline_comment = 1 ; _style = "comment" ; }
    else if ( ( _prev_char + _curr_char ) == "/*" && !_multiline_comment ) { _multiline_comment = 1; _style = "comment" ; }
    else if ( ( _prev_char + _curr_char ) == "*/" && _multiline_comment ) { _multiline_comment = 0 ; _style = "" ; }
    else if ( _oneline_comment || _multiline_comment ) _style = "comment" ;
    else _style = "" ;
		return _style ; 
}

/*
var _glob_reg_ex = [
										 [ /^[0-9\.]+(?:[eE][+\-]?\d+)?/, "number" ],
										 [ /^\b([\<\=\>])+\b/g, "atom" ]
									 ] ;
*/

var custom_check_stream_fn = function( stream )
{
		var _i = 0 ;
		
		var _editor_settings = _glob_script_editor_highlights, _ret ;
		for( _i = 0 ; _i < _editor_settings.length ; _i++ )
    {
        _ret = stream.match( _editor_settings[_i][1] ) ? 1 : 0 ;
        console.log( _editor_settings[_i][0], _editor_settings[_i][1], _ret );
    		if ( _ret ) return _editor_settings[_i][0] ;
    }

		for( _i = 0 ; _i < _glob_script_editor_reserved_javascript.length ; _i++ )
    {
        _ret = stream.match( _glob_script_editor_reserved_javascript[_i] ) ? 1 : 0 ;
    		if ( _ret ) return "js_reserved" ;
    }

		for( _i = 0 ; _i < _glob_script_editor_circles_objs_marker.length ; _i++ )
    {
        _ret = stream.match( _glob_script_editor_circles_objs_marker[_i] ) ? 1 : 0 ;
    		if ( _ret ) return "circles_reserved" ;
    }

		for( _i = 0 ; _i < _glob_script_editor_reserved_circles.length ; _i++ )
    {
        _ret = stream.match( _glob_script_editor_reserved_circles[_i] ) ? 1 : 0 ;
    		if ( _ret ) return "circles_markers" ;
    }

		return "" ;
}

CodeMirror.defineMode("custom.mode", function()
{
    return {
        token: function(stream,state)
				{
						var _ret = custom_check_stream_fn( stream ) ;
            console.log( "RET", _ret );
						if ( _ret.length > 0 ) return _ret ;
	          else { stream.next(); return null; }
        }
    };
});