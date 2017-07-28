function CIRCLESformsDICTIONARYdispatcher()
{
      /* INDEX <---> arguments mapping
         0: message ID : identifier related to the message sent to this dispatcher function
         1: pop-up window ID : archive index of the registered pop-up window: it is required to find the related obj
                               and gain access to the stored features
         2 and more: arguments with index greater than 1 supply additional parameters, customizable for each message
      */ 
			if ( arguments.length > 0 )
			{
					 var MESSAGE_ID = safe_string( arguments[0], POPUP_DISPATCHER_UNICAST_EVENT_UNKNOWN );
					 var POPUP_INDEX = safe_int( arguments[1], 0 );
					 switch( MESSAGE_ID )
					 {
                case POPUP_DISPATCHER_MULTICAST_EVENT_RESIZE_ALL:
                var _sw = $(window).width(), _sh = $(window).height() ;
                var _div_id = _glob_popups_array[ POPUP_INDEX ][1] ;
                var _suffix = _glob_popups_array[ POPUP_INDEX ][9] ;
                $( "#" + _div_id ).height( _sh - 70 ) ;
                circles_lib_forms_adjust_position( _div_id ) ;
		            var _sw = $(window).width(), _sh = $(window).height() ;
		            if ( _sw < $( "#"+_div_id ).width() )
		            {
		            		var _resize_fns = [ "CIRCLESformsDICTIONARYmaximize", _div_id, "", "" ] ; 
				            circles_lib_popup_maximize( _div_id, _resize_fns.join( "|" ) ) ;
								}
                break ;
                case POPUP_DISPATCHER_MULTICAST_EVENT_UPDATE_ALL:
                break ;
					 			case POPUP_DISPATCHER_UNICAST_EVENT_FOCUS:
                $("#customloader").get(0).onchange = function() { circles_lib_files_open_upload_dialog( CIRCLESformsDICTIONARYload ) } ;
					 			break ;
					 			case POPUP_DISPATCHER_UNICAST_EVENT_BLUR:
					 			break ;
					 			case POPUP_DISPATCHER_UNICAST_EVENT_CLOSE:
								if ( circles_lib_popup_exists( CIRCLESformsDICTIONARYbaseid, POPUP_SEARCH_BY_BASE_ID ) != UNFOUND )
								circles_lib_popup_activate( NO, "dictionary", "forms", CLOSE, "POPUPdictionaryinputformDIV", '', "" );
						    if ( $("#" + CIRCLESformsDICTIONARYdiv_id).resizable('instance') != undefined )
                $("#" + CIRCLESformsDICTIONARYdiv_id).resizable('destroy');

                circles_lib_popup_activate( NO, GLOB_PLUGIN_BASE_ID, '', '', GLOB_PLUGIN_SUBSET, CLOSE, GLOB_PLUGIN_DIV_ID,'' );
					 			break ;
		          case POPUP_DISPATCHER_UNICAST_EVENT_RELOAD:
		          var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		          var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		          circles_lib_popup_load( _subset, _base_id, NO ) ;
		          break ;
								case 1.1: // reload main dialog
								circles_lib_popup_load('forms','dictionary');
								break ;
                case POPUP_DISPATCHER_UNICAST_EVENT_REFRESH_CONTENTS:
                var _dict_size = _glob_dict_processor.sliced_dict_size();
                CIRCLESformsDICTIONARYmax_entries_per_page = Math.min( 500, 200 * Math.log10( _dict_size ) );
	        			_glob_original_dict = _glob_dict_processor.sliced_dict_resize( CIRCLESformsDICTIONARYmax_entries_per_page, YES );
						    $( "#PAGING_CONTAINER" ).html( CIRCLESformsDICTIONARYpagingPROCESS( 0 ) );
								CIRCLESformsDICTIONARYdisplayPAGE(0, "");
								break ;
		          case POPUP_DISPATCHER_UNICAST_EVENT_REMOTE_CONTROL:
		          var _subset = _glob_popups_array[ POPUP_INDEX ][8] ;
		          var _base_id = _glob_popups_array[ POPUP_INDEX ][12] ;
		          circles_lib_popup_remotectrl_dispatch_to_service( _subset, _base_id, arguments ) ;
		          break ;
							case 2.1: // reload alphabet combo
							var _combo_code = CIRCLESformsDICTIONARYgetALPHABETcomboCODE( '' );
              $( "#CIRCLESformsDICTIONARYalphabetSYMBOL" ).html( ( safe_size( _glob_alphabet, 0 ) > 0 ? _combo_code : "<SPAN STYLE=\"color:#909090;\">None</SPAN>" ) );
              if ( safe_size( _glob_alphabet, 0 ) > 0 ) $( "#CIRCLESformsDICTIONARY" ).slideDown( "slow", function() {} );
							break ;
							case 3.0: //
							_glob_dict_processor.sliced_dictionary_upper_bound = CIRCLESformsDICTIONARYmax_entries_per_page ;
							break ;
							case 4.0:
	            $("#PAGING_CONTAINER").html( CIRCLESformsDICTIONARYpagingPROCESS( 0 ) );
							CIRCLESformsDICTIONARYdisplayPAGE(0, "");
							break ;
							case 5.0:
			     		if ( _glob_dict_processor.sliced_dict_get_chunk_size() > CIRCLESformsDICTIONARYmax_entries_per_page )
			     		_glob_original_dict = _glob_dict_processor.sliced_dictionary = _glob_dict_processor.sliced_dictionary.dismember( CIRCLESformsDICTIONARYmax_entries_per_page );
			        CIRCLESformsDICTIONARYpagingPROCESS(0);
			        CIRCLESformsDICTIONARYdisplayPAGE(0, "");
							break ;
              default: break ;
					 }
			}
}