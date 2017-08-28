function circles_lib_canvas_process_ask( _question, _silent, _plane_type, _render, _b_clean, _b_init_items, _selected_layers_array, _out_channel )
{
		_plane_type = circles_lib_return_plane_type( _plane_type, YES ) ;
    _question = safe_int( _question, YES ), _silent = safe_int( _silent, NO );
    _render = safe_int( _render, YES ), _b_clean = safe_int( _b_clean, YES );
    _b_init_items = safe_int( _b_init_items, CHECK );
    if ( _b_init_items == CHECK ) _b_init_items = _glob_items_to_init ;
    _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
    var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
    if ( !is_array( _selected_layers_array ) ) _selected_layers_array = [] ;
    
    var _ret_chunk = circles_lib_triggers_open_all_automated_entries( YES, _out_channel );
    var _ret_id = _ret_chunk[0] ;
    if ( _ret_id == RET_ERROR )
    {
       if ( !_silent && _out_channel == OUTPUT_SCREEN )
       alert_msg( ALERT_ERROR, _ret_chunk[1] + ( is_array( _ret_chunk[2] ) ? " : " + _ret_chunk[2].join( ", " ) : "" ), _glob_app_title );
       return ;
    }

    if ( _glob_use_last_pt ) _b_clean = NO ;

    var _sh = $(window).height() ;
    var DIV_WIDTH = 530, BOX_WIDTH = DIV_WIDTH - 120 ;
    var _ok_plane_type = _plane_type.is_one_of( Z_PLANE, W_PLANE, BIP_BOX, ALL_PLANES ) ? YES : NO ;
    _glob_bip_use = _plane_type == BIP_BOX ? YES : NO ;
      
    var _plane_type_label = circles_lib_plane_get_def( _plane_type );
    var _items_n = circles_lib_count_items(), _draw_all = YES, _fill_all = YES, _HALT = NO ;
    for( var _i = 0 ; _i < _items_n ; _i++ )
    {
        _draw_all &= _items_array[_i].complex_circle.draw ;
        _fill_all &= _items_array[_i].complex_circle.fill ;
    }

    if ( _items_n > 0 )
    {
         var _min_width_for_div = 620 ;
         var _rnd_table_size = circles_lib_count_rnd_probabilities(), _sch_n = circles_lib_count_gens_set_model();
         if ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM && _sch_n != _rnd_table_size )
         {
            var _msg = "The gens set ("+_sch_n+" element"+( _sch_n == 1 ? "" : "s" )+") is not congruent with the random table ("+_rnd_table_size+" element"+( _rnd_table_size == 1 ? "" : "s" )+")." ;
            if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
            return [ RET_ERROR, _msg ];
         }
         else if ( _glob_method == METHOD_NONE && _plane_type == W_PLANE )
         {
            var _msg = "No method was chosen yet."+_glob_crlf+"Please choose one !" ;
            if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
            return [ RET_ERROR, _msg ];
         }
         else if ( _glob_depth == 0 )
         {
            var _msg = "Depth must be greater than zero" ;
            if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
            return [ RET_ERROR, _msg ];
         }

         var _advice_cnt = 0 ;
         var _check_group = circles_lib_symbol_check_group( _items_array );
         var _items_error = circles_lib_items_check_data_coherence();
         var _process_fail_error = _glob_process == PROCESS_NONE ? YES : NO ;
         var _repetends_fail_error = typeof CIRCLESmethodMANAGERrepetendsCHECK === "function" ? !CIRCLESmethodMANAGERrepetendsCHECK() : NO ;
         var _repetends_exists = circles_lib_repetends_exist();
         var _rnd_sum = safe_float( _glob_rnd_probability_array.sum().toFixed( _glob_accuracy ), 0 ).clean_round_off( 2 );
         var _rnd_sum_check = _rnd_sum == 1.0 ? YES : NO ;

         if ( !is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) )
         _glob_zplane_rendering_canvas_placeholder = _glob_zplane_rendering_canvas_placeholder ;
         if ( is_html_canvas( _glob_wplane_rendering_canvas_placeholder ) )
         _glob_wplane_rendering_canvas_placeholder = _glob_wplane_rendering_canvas_placeholder ;
         if ( is_html_canvas( _glob_bip_canvas_placeholder ) ) _glob_bip_canvas_placeholder = _glob_bip_canvas ;

         if ( _question )
         {
             // splash box contents arrangement
             var HTMLcode = "<table WIDTH=\""+BOX_WIDTH+"\" BORDER=\"0\">" ;
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             var _n_palette = safe_size( _glob_palette_array, 0 );
             if ( _glob_palette_use && _glob_depth > _n_palette && _plane_type.is_one_of( W_PLANE, BIP_BOX, ALL_PLANES ) )
             {
                 HTMLcode += "<tr>" ;
                 HTMLcode += "<td valign=\"top\" WIDTH=\""+BOX_WIDTH+"\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;padding:6px;\">" ;
                 HTMLcode += "<table WIDTH=\"100%\">" ;
                 HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                 HTMLcode += "<tr><td STYLE=\"padding-left:6px;\">Note #"+(_advice_cnt+1)+": depth is larger than palette size</td></tr>";
                 HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                 HTMLcode += "<tr><td STYLE=\"padding-left:6px;\">Confirm to resize the palette and fit the depth value ?</td></tr>";
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 HTMLcode += "<tr><td ALIGN=\"right\" VALIGN=\"top\"><table><tr><td CLASS=\"link_rounded\" ONCLICK=\"javascript:var _ret_chunk=circles_lib_colors_compute_gradient('','',"+_glob_depth+",NO);_glob_palette_array=_ret_chunk[1];alertCLOSE();circles_lib_canvas_process_ask("+_question+","+_silent+","+_plane_type+","+_render+","+_b_clean+","+_b_init_items+",'"+_selected_layers_array.join(',')+"');\" STYLE=\"width:140px;\">Resize palette to "+_glob_depth+" entr"+(_glob_depth==1?"y":"ies")+"</td></tr></table></td></tr>" ;
                 HTMLcode += "</table>" ;
                 HTMLcode += "</td>" ;
                 HTMLcode += "</tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                 _advice_cnt++ ;
             }

             if( _glob_use_last_pt )
             {
                 HTMLcode += "<tr>" ;
                 HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;padding:6px;\">" ;
                 HTMLcode += "<table WIDTH=\"100%\">" ;
                 HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                 HTMLcode += "<tr><td STYLE=\"padding-left:6px;\">Note #"+(_advice_cnt+1)+": no cleaning action will be perfomed on canvas</td></tr>";
                 HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                 HTMLcode += "<tr><td STYLE=\"padding-left:6px;\">because of 'Use last point' has been flagged on</td></tr>";
                 HTMLcode += "</table>" ;
                 HTMLcode += "</td>" ;
                 HTMLcode += "</tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                 _advice_cnt++ ;
             }

             HTMLcode += "<tr><td WIDTH=\""+BOX_WIDTH+"\" VALIGN=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#ECECEC;padding:2px;\">" ;
             HTMLcode += "<table WIDTH=\""+BOX_WIDTH+"\">" ;
             HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
             HTMLcode += "<tr><td>Please, before starting to render, consider these settings</td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 
             if ( _check_group != GROUP_TEST_ERR_OK && _plane_type.is_one_of( W_PLANE, BIP_BOX, ALL_PLANES ) )
             {
                 HTMLcode += "<tr>" ;
                 HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#F8F8F8;padding:3px;\">" ;
                 HTMLcode += "<table>" ;
                 HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);alertCLOSE();circles_lib_canvas_process_ask("+_question+","+_silent+","+_plane_type+","+_render+","+_b_clean+","+_b_init_items+",'"+_selected_layers_array.join(',')+"');\">Symbols need to be set</td></tr>";
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:circles_lib_alphabet_autoconfig_all_symbols(YES,NO,NO);alertCLOSE();circles_lib_canvas_process_ask("+_question+","+_silent+","+_plane_type+","+_render+","+_b_clean+","+_b_init_items+",'"+_selected_layers_array.join(',')+"');\">Click here to go</td></tr>";
                 HTMLcode += "</table>" ;
                 HTMLcode += "</td>" ;
                 HTMLcode += "</tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                 _HALT = YES ;
                 _advice_cnt++ ;
             }
                 
             if ( _glob_drawentity == DRAWENTITY_NONE )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFBFA7;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td ALIGN=\"center\">Be careful !</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td ALIGN=\"center\">The 'draw entity' param has been switch to NONE, thus no graphic rendering will be performed</td></tr>";
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                _advice_cnt++ ;
             }

             if ( !_rnd_sum_check && _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFBFA7;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_ERROR+";\">Computation errors while assigning probabilities to random process</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:alertCLOSE();circles_lib_plugin_load('forms','method',YES,0,_glob_method);\">Open the method panel</td></tr>";
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                _HALT = YES ;
                _advice_cnt++ ;
             }
                  
             if ( _repetends_fail_error != 0
                  && _plane_type.is_one_of( W_PLANE, BIP_BOX, ALL_PLANES )
                  && _glob_method == METHOD_ALGEBRAIC )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFBFA7;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_ERROR+";\">Syntax errors detected in repetends definitions</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td CLASS=\"link\" ONCLICK=\"javascript:alertCLOSE();circles_lib_plugin_load('forms','method',YES,0,_glob_method);\">Open the method panel</td></tr>";
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                _HALT = YES ;
                _advice_cnt++ ;
             }
                  
             if ( !_draw_all && _glob_drawentity.is_one_of( DRAWENTITY_PIXEL, DRAWENTITY_POINT ) )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:white;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">The draw flag of some gens is off</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">This option could not compatible to pixel object</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">Please, set it on for securing the diagram to appear</td></tr>";
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                _advice_cnt++ ;
             }
             else if ( !_fill_all && _glob_drawentity == DRAWENTITY_POINT )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFDB71;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">The fill flag of some gens is off</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">This option could not compatible to point object</td></tr>";
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_WARNING+";\">Please, set it on for securing the diagram to appear</td></tr>";
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
                _advice_cnt++ ;
             }

             if ( ( _items_error != ITEM_ERR_NONE || _glob_items_to_init )
                  && _plane_type.is_one_of( W_PLANE, BIP_BOX, ALL_PLANES ) )
             {
                HTMLcode += "<tr>" ;
                HTMLcode += "<td valign=\"top\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:#FFCEB9;padding:3px;\">" ;
                HTMLcode += "<table>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;

                if ( _items_error == ITEM_ERR_CIRCLE )
                HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">At least one circle is missing</td></tr>" ;
                else if ( _items_error == ITEM_ERR_MOBIUS )
                HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\">At least one map is missing</td></tr>" ;
                else if ( _glob_items_to_init )
                {
                   HTMLcode += "<tr><td STYLE=\"padding-left:6px;color:"+DEFAULT_COLOR_ERROR+";\">Generators still need to be initialized</td></tr>" ;
                   HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                   HTMLcode += "<tr><td STYLE=\"padding-left:6px;\" CLASS=\"link\" ONCLICK=\"javascript:_glob_items_to_init=NO;$('[id$=initBTN]').css('color',DEFAULT_COLOR_STD);circles_lib_items_init(null,NO,YES);alertCLOSE();circles_lib_canvas_process_ask("+_question+","+_silent+","+_plane_type+","+_render+","+_b_clean+","+_b_init_items+",'"+_selected_layers_array.join(',')+"');\">Force fixing</td></tr>" ;
                }
    
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "</table>" ;
                HTMLcode += "</td>" ;
                HTMLcode += "</tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;

                _HALT = YES ;
                _advice_cnt++ ;

    						if ( _sh < _min_width_for_div )
     						{
    				 			 var _div_h = Math.max( 100, _sh - 340 ) ;
    							 //HTMLcode += "<tr><td VALIGN=\"top\" WIDTH=\""+BOX_WIDTH+"\">" ;
    				 			 //HTMLcode += "<DIV STYLE=\"position:relative;width:"+(BOX_WIDTH-10)+";height:"+_div_h+"px;overflow:auto;\">" ;
    					 		 //HTMLcode += "<table>" ;
    						}
             }

             if (_glob_bip_use)
             {
                HTMLcode += "<tr><td>Bip activated : <b>Yes</b></td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                var _bip_coords_src_plane = circles_lib_plane_get_def( _glob_bip_original_plane_coords ) ;
                var _bip_data_src_plane = circles_lib_plane_get_def( _glob_bip_original_plane_data ) ;
                HTMLcode += "<tr><td>Bip coords source : <b>"+_bip_coords_src_plane+"</b></td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td>Bip data source : <b>"+_bip_data_src_plane+"</b></td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             }

             HTMLcode += "<tr><td HEIGHT=\"10\"></td></tr>" ;
             HTMLcode += "<tr><td>Clean diagram <b>"+( _b_clean ? "Yes" : "No" )+"</b></td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             HTMLcode += "<tr><td>Render figures <b>"+( _render ? "Yes" : "No" )+"</b></td></tr>" ;
             HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                  
             if ( _plane_type != BIP_BOX )
             {
                HTMLcode += "<tr><td>Z-plane rendering redirected to <b>"+circles_lib_canvas_layer_explain_role( Z_PLANE, _glob_zplane_rendering_canvas_placeholder.get_role_id() )+"</b> layer</td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                HTMLcode += "<tr><td>W-plane rendering redirected to <b>"+circles_lib_canvas_layer_explain_role( W_PLANE, _glob_wplane_rendering_canvas_placeholder.get_role_id() )+"</b> layer</td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             }

             if ( _plane_type == Z_PLANE )
             {
                 HTMLcode += "<tr><td>Refresh the Z-plane</td></tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             }
             else if ( _plane_type.is_one_of( W_PLANE, BIP_BOX ) )
             {
                 HTMLcode += "<tr>" ;
                 HTMLcode += "<td VALIGN=\"top\">" ;
                 HTMLcode += "<table>" ;
                 if ( _plugin_main_ref > 0 )
                 {
                    HTMLcode += "<tr><td>Plug-in <b>"+( _glob_submethod_desc.length > 0 ? "("+_glob_submethod_desc+")" : "" )+"</b></td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 }
                 HTMLcode += "<tr><td>Method <b>"+circles_lib_method_get_def( _glob_method )+"</b></td></tr>" ;
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 HTMLcode += "<tr><td>Construction mode <b>"+circles_lib_construction_mode_get_def( _glob_construction_mode )+"</b></td></tr>" ;
                 if ( _glob_method == METHOD_ALGEBRAIC )
                 {
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		                HTMLcode += "<tr><td>Process <b>"+circles_lib_process_get_def( _glob_process )+"</b></td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
		                HTMLcode += "<tr><td>Fixed point <b>"+circles_lib_fixedpoints_io_get_def( _glob_fixedpt_io )+"</b></td></tr>" ;
								 }
                          
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 HTMLcode += "<tr><td>Draw entity <b>"+circles_lib_drawentity_get_def( _glob_drawentity )+"</b></td></tr>" ;
    
                 HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 HTMLcode += "<tr><td>Depth <b>"+_glob_depth+"</b></td></tr>" ;
    
                 if ( _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) &&
                     _glob_process != PROCESS_RANDOM )
                 {
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                    HTMLcode += "<tr><td>Recompute dictionary <b>"+( _glob_dict_create ? "Yes</b>" : "No</b>" )+"</td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                    HTMLcode += "<tr><td>Apply Repetends <b>"+( _repetends_exists ? "Yes" : "No" )+"</b></td></tr>" ;
                 }

                 if ( _glob_volatile_settings['f.z.formula'] != null )
                 {
                     if ( safe_size( _glob_volatile_settings['f.z.formula'], 0 ) > 0 )
                     {
                         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                         HTMLcode += "<tr><td>Rendered entities will be remapped by <b>"+( _glob_volatile_settings['f.z.formula'] )+"</td></tr>" ;
                         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                     }
                 }

                     HTMLcode += "</table>" ;
                     HTMLcode += "</td>" ;
                     HTMLcode += "</tr>" ;
                     HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                      
                     if ( _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_NONE )
                     {
                         HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
                         HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">Can't run the construction</td></tr>" ;
                         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                         HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">Missing process reference</td></tr>" ;
                         HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                         _process_fail_error = _HALT = YES ;
                     }

    						 if ( _sh < _min_width_for_div )
    						 {
   						 		  //HTMLcode += "</table>" ;
   						 		  //HTMLcode += "</div>" ;
   						 		  //HTMLcode += "</td></tr>" ;
                    //HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
								 }

		             HTMLcode += "</table></td></tr>" ;
                 if ( !_HALT )
                 {
                    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
                    HTMLcode += "<tr>" ;
                    HTMLcode += "<td VALIGN=\"top\" CLASS=\"general_rounded_corners_bottom\" STYLE=\"background-color:#F7F7F7;padding:5px;\">" ;
                    HTMLcode += "<table>" ;
                    HTMLcode += "<tr>" ;
                    HTMLcode += "<td>... and finally <b>export</b> this rendering in this format</td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "<td><SELECT ID=\"ASKexportCOMBO\" ONCHANGE=\"javascript:_glob_export_format=safe_int( this.options[this.selectedIndex].value, EXPORT_NONE );_glob_export_code_array=[];$('[id$=exportCOMBO]').get(0).selectedIndex=this.selectedIndex;\">" ;
                    HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_NONE ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_NONE+"\">None" ;
                    HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_SVG ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_SVG+"\">SVG" ;
                    HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_PS ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_PS+"\">PS" ;
                    HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_EPS ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_EPS+"\">Encapsulated PS" ;
                    HTMLcode += "<OPTION "+( _glob_export_format == EXPORT_LATEX ? "SELECTED=\"selected\"" : "" )+" VALUE=\""+EXPORT_LATEX+"\">LaTeX" ;
                    HTMLcode += "</SELECT></td>" ;
                    HTMLcode += "<td WIDTH=\"5\"></td>" ;
                    HTMLcode += "</tr>" ;
                    HTMLcode += "</table>" ;
                    HTMLcode += "</td>" ;
                    HTMLcode += "</tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"1\"></td></tr>" ;
                 }
                      
                 if ( _items_error != ITEM_ERR_NONE || _check_group != GROUP_TEST_ERR_OK || _repetends_fail_error || _HALT ||
											( !_rnd_sum_check && _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM )
										)
                 {
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                    HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">Can't run the construction</td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"3\"></td></tr>" ;
                    HTMLcode += "<tr><td STYLE=\"color:"+DEFAULT_COLOR_ERROR+";\" ALIGN=\"center\">Please, fix problems first</td></tr>" ;
                    HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
                 }
                 /*
                 else if ( !_HALT )
                 {
                 }
                 */
             }
             else
             {
                HTMLcode += "<tr><td>Unknown operation</td></tr>" ;
                HTMLcode += "<tr><td HEIGHT=\"5\"></td></tr>" ;
             }

              HTMLcode += "</table>" ;
              HTMLcode += "</td></tr><tr><td HEIGHT=\"5\"></td></tr></table>" ;

              var CAPTION = _glob_app_title + " - " + _plane_type_label ;
              alert_plug_label( ALERT_YES, "Render" );

              if ( _plane_type.is_one_of( Z_PLANE ) )
              alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_canvas_render_zplane( null, zplane_sm, '"+_selected_layers_array.join(',')+"', "+_b_clean+", YES, "+_render+", "+_question+", YES, YES, "+_out_channel+" );" );
              else if ( _plane_type.is_one_of( W_PLANE ) )
              {
                 alert_plug_label( ALERT_NO, ( _items_error != ITEM_ERR_NONE || _check_group != GROUP_TEST_ERR_OK || _repetends_fail_error ||
   																				   ( !_rnd_sum_check && _glob_method == METHOD_ALGEBRAIC && _glob_process == PROCESS_RANDOM ) ) ? "Close" : "No" );
                 alert_plug_label( ALERT_CANCEL, "Init but no render" );
                 alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_canvas_render_wplane( null, wplane_sm, '"+_selected_layers_array.join(',')+"', "+_b_clean+", YES, "+_render+", "+_b_init_items+", "+_question+", YES, "+_out_channel+" );" );
              }
              else if ( _plane_type == BIP_BOX )
              alert_plug_fn( ALERT_YES, "alertCLOSE();circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, '"+_selected_layers_array.join(',')+"', "+_b_clean+", YES, "+_render+", "+_b_init_items+", "+_question+", YES, "+_out_channel+" );" );
              else if ( _plane_type == NO_PLANE ) alert_plug_fn( ALERT_YES, "alertCLOSE();" );

              var ICON = "icons/gearwheel/gearwheel.icon.01.64x64.png" ;
              var _mode = _HALT ? DISPATCH_HALT | DISPATCH_YESNO : DISPATCH_QUESTION | ( _plane_type.is_one_of( Z_PLANE ) ? DISPATCH_YESNO : DISPATCH_YESNOCANCEL ) ;

              if ( _HALT ) alert_plug_label( ALERT_YES, "Don't care !" );
              
              alert_plug_fn( ALERT_CANCEL, "alertCLOSE();" );
              alert_plug_fn( ALERT_NO, "alertCLOSE();" );
              alert_set_btns_width( _plane_type.is_one_of( Z_PLANE ) ? 60 : 110 );
              alert_msg( _mode, HTMLcode, CAPTION, DIV_WIDTH, '', ICON );
              alert_enable_btn( "YESbtn", ( _items_error != ITEM_ERR_NONE || _check_group != GROUP_TEST_ERR_OK || _repetends_fail_error || !_ok_plane_type ) ? DISABLED : ENABLED );
              return [ RET_OK, _plane_type_label + ": ask for rendering" ] ;
          }
          else // if silent
          {
              if ( ( _items_error != ITEM_ERR_NONE || _check_group != GROUP_TEST_ERR_OK || _repetends_fail_error || !_rnd_sum_check ) && _out_channel != OUTPUT_SCREEN )
              {
                 var _msg = "The following elements need to be initialized or reset:" ;
                 if ( _items_error == ITEM_ERR_MOBIUS ) _msg += _glob_crlf + "gens" ;
                 if ( _check_group != GROUP_TEST_ERR_OK ) _msg += _glob_crlf + "symbols" ;
                 if ( _repetends_fail_error ) _msg += _glob_crlf + "repetends" ;
                 if ( !_rnd_sum_check ) _msg += _glob_crlf + "random probabilities sum" ;
                 if ( _glob_method.is_one_of( METHOD_ALGEBRAIC ) ) _msg += _glob_crlf + "Check whether the inverse generator has been input." + _glob_crlf ;
                 return [ RET_ERROR, _msg ] ;
              }
              else
              {
                 if ( !is_html_canvas( _glob_zplane_rendering_canvas_placeholder ) )
                 _glob_zplane_rendering_canvas_placeholder = _glob_zplane_rendering_canvas_placeholder ;
                 if ( is_html_canvas( _glob_wplane_rendering_canvas_placeholder ) )
                 _glob_wplane_rendering_canvas_placeholder = _glob_wplane_rendering_canvas_placeholder ;
                 if ( is_html_canvas( _glob_bip_canvas_placeholder ) ) _glob_bip_canvas_placeholder = _glob_bip_canvas ;

                  var _plane_def = circles_lib_plane_get_def( _plane_type );
                  if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
                  {
                     var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _b_clean, YES, _render, _question, YES, _out_channel );
                     var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                     var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                     return _ret_chunk ;
                  }
                  else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
                  {
                     var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, _b_clean, YES, _render, _b_init_items, _question, YES, _out_channel );
                     var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                     var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                     return _ret_chunk ;
                  }
                  else if ( _plane_type == BIP_BOX )
                  {
                     var _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _b_clean, YES, _render, _b_init_items, _question, YES, _out_channel );
                     var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                     var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                     return _ret_chunk ;
                  }
                  else return [ RET_ERROR, "Can't refresh : missing input plane" ] ;
              }
          }
     }
     else if ( _items_n == 0 )
     {
          if ( _out_channel == OUTPUT_SCREEN && !_silent )
          {
             circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _ERR_33_01, _glob_app_title );
             return [ RET_ERROR, _ERR_33_01 ] ;
          }
          else
          {
             var _plane_def = circles_lib_plane_get_def( _plane_type );
             if ( _plane_type.is_one_of( Z_PLANE, ALL_PLANES ) )
             {
                 var _ret_chunk = circles_lib_canvas_render_zplane( null, zplane_sm, null, _b_clean, YES, _render, _question, YES, _out_channel );
                 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                 return _ret_chunk ;
             }
             else if ( _plane_type.is_one_of( W_PLANE, ALL_PLANES ) )
             {
              	 if ( _glob_interface_index != INTERFACE_EXTEND_NONE && !_glob_use_last_pt ) circles_lib_canvas_plane_refresh(W_PLANE,NO) ;
                 var _ret_chunk = circles_lib_canvas_render_wplane( null, wplane_sm, null, _b_clean, YES, _render, _b_init_items, _question, YES, _out_channel );
                 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                 return _ret_chunk ;
             }
             else if ( _plane_type == BIP_BOX )
             {
                 var _ret_chunk = circles_lib_canvas_render_bipbox( _glob_bip_original_plane_data, null, _b_clean, YES, _render, _b_init_items, _question, YES, _out_channel );
                 var _ret_id = is_array( _ret_chunk ) ? safe_int( _ret_chunk[0], NO ) : NO ;
                 var _ret_msg = is_array( _ret_chunk ) ? _ret_chunk[1] : _ERR_00_00 ;
                 return _ret_chunk ;
             }
             else return [ RET_ERROR, "Can't refresh : missing input plane" ] ;
          }
     }
     else if ( _items_n == UNDET ) return [ RET_ERROR, "Can't refresh: missing items declaration" ];
}

function circles_lib_canvas_render_process( canvas, mapper, _plane_type, _silent, _out_channel )
{
     _plane_type = safe_int( _plane_type, W_PLANE ) ;
     _silent = safe_int( _silent, NO ), _out_channel = safe_int( _out_channel, OUTPUT_SCREEN );
     var _items_array = _glob_items_switch == ITEMS_SWITCH_GENS ? _glob_gens_array : _glob_seeds_array ;
     var _sd_n = circles_lib_count_items( _items_array ) ;
     if ( !is_html_canvas( canvas ) )
     {
         var _msg = "Missing layer ref" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_CRITICAL, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ] ;
     }
     else if ( _glob_items_to_init )
     {
     		 var _msg = "Can't draw: seeds need to be initialized again" ;
         if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
         return [ RET_ERROR, _msg ] ;
     }
     else if ( _sd_n == 0 )
     {
         // straight call of the procedures ending the drawing process
         circles_lib_canvas_after_process_main();
         return [ RET_ERROR, _ERR_33_01 ] ;
     }
     else if ( _sd_n > 0 )
     {
         _glob_options_mask = circles_lib_operations_get_mask();
         var _check_group = circles_lib_symbol_check_group( _items_array );
         var _items_error = circles_lib_items_check_data_coherence();
         var _ret_chunk = _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? circles_lib_items_group_consistence_test() : [ UNDET, "Missing algebraic method: skipped group consistence check" ] ;
         var _err = _glob_method.is_one_of( METHOD_ALGEBRAIC ) ? safe_int( _ret_chunk['ret'], 0 ) : 0 ;
         var _entries_n = _ret_chunk['n'] != null ? safe_int( _ret_chunk['n'], 0 ) : circles_lib_count_items();
         if ( _err < 0 )
         {
              _ret_chunk = circles_lib_items_group_return_msg( _err, _entries_n );
              var _ret_id = _ret_chunk[0], _ret_msg = safe_string( _ret_chunk[1], "20Unknown error" );
              if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, _ret_id >= 0 ? DISPATCH_SUCCESS : DISPATCH_ERROR, _ret_msg, _glob_app_title );
              return [ RET_ERROR, _msg ];
         }
         else if ( _check_group != GROUP_TEST_ERR_OK && _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) )
         {
              var _msg = circles_lib_symbol_get_err_def( _check_group, _out_channel );
              if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, _msg, _glob_app_title );
              return [ RET_ERROR,_msg ];
         }
         else if ( _items_error != ITEM_ERR_NONE && _glob_method.is_one_of( METHOD_INVERSION, METHOD_ALGEBRAIC ) )
         {
              var errMSG = "There is at least one generator which has not been initialized or filled up" ;
              if ( _out_channel == OUTPUT_SCREEN ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_ERROR, errMSG, _glob_app_title );
              return [ RET_ERROR, errMSG ] ; 
         }
         else
         {
           if ( _glob_worker_lock == 0 )
           {
             var _ret_chunk = CIRCLESmultithreadingPROCESSrendering( canvas, mapper, _glob_method, _glob_process, _glob_fixedpt_io, _plane_type, _silent, _out_channel );
             return _ret_chunk ;
           }
           else if ( _glob_worker_lock == 1 )
           {
             var _msg = "Only one process can be run at once" ;
             if ( _out_channel == OUTPUT_SCREEN && !_silent ) circles_lib_output( OUTPUT_SCREEN, DISPATCH_WARNING, _msg, _glob_app_title );
             return [ RET_ERROR, _msg ] ;
           }
         }
     }
     else return [ RET_ERROR, "21Unknown error" ] ;
}