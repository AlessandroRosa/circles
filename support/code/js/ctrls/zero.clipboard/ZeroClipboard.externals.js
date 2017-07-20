var _zeroclipboard_env_path_to_swf = "" ;
var _zeroclipboard_env_swf_file = "" ;
var _zeroclipboard_env_enabled = 0 ;

function zeroclipboardINIT()
{
			ZeroClipboard.config( {
                              moviePath: _zeroclipboard_env_path_to_swf + _zeroclipboard_env_swf_file,
                              swfPath: _zeroclipboard_env_path_to_swf + _zeroclipboard_env_swf_file
                            } );
}

function zeroclipboardSETUP( _btn_id, _textctrl_id, _output_ctrl_id, _pre_copy_fn )
{
      if ( $('#'+_btn_id).get(0) != null && $('#'+_textctrl_id).get(0) != null && _zeroclipboard_env_enabled )
      {
          _glob_zeroclipboard_ctrl = new ZeroClipboard( $('#'+_btn_id).get(0) );
    
    			_glob_zeroclipboard_ctrl.on( 'load', function(client)
    			{
    			  _glob_zeroclipboard_ctrl.on( 'datarequested', function(client)
    				{
								if ( typeof _pre_copy_fn === "function" ) _pre_copy_fn.apply( this );

                switch( $( '#'+_textctrl_id ).get(0).tagName.toLowerCase() )
                {
                      case "td":
                      _glob_zeroclipboard_ctrl.setText( $('#'+_textctrl_id).html() );
                      break ;
                      case "textarea":
                      _glob_zeroclipboard_ctrl.setText( $('#'+_textctrl_id).val() );
                      break ;
                }
    			  });
    			
        		// callback triggered on successful copying
        		_glob_zeroclipboard_ctrl.on( 'complete',
                                         function(client, args)
                                         {
                                            if ( $( "#" + _output_ctrl_id ).get(0) != null )
                                            {
                                                switch( $( '#'+_output_ctrl_id ).get(0).tagName.toLowerCase() )
                                                {
                                                    case "td":
                                                    $( '#'+_output_ctrl_id ).html( "<SPAN STYLE=\"color:#5A99D5;\">Copied into clipboard !</SPAN>" ) ;
                                                    setTimeout(function(){ $( '#'+_output_ctrl_id ).html( "" ); }, 4000);
                                                    break ;
                                                    case "textarea":
                                                    $( '#'+_output_ctrl_id ).val( "Copied into clipboard !" ) ;
                                                    setTimeout(function(){ $( '#'+_output_ctrl_id ).html( "" ); }, 4000);
                                                    break ;
                                                }
                                            }
                                         }
                                       );
    			});
    			
    			// In case of error - such as Flash not being available
    			_glob_zeroclipboard_ctrl.on( 'wrongflash noflash', function() { ZeroClipboard.destroy(); } );
      }
}