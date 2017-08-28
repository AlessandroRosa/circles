function CIRCLESformsSCRIPTEDITORcodemanagerLISTcountSELECTED( _proj_label ) { return circles_lib_js_manager_scripts_count_selected( safe_string( _proj_label, CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ).trim() ) ; }
function CIRCLESformsSCRIPTEDITORcodemanagerLISTprojectsCOMBO()
{
		var _scripts_array = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT], HTMLcode = "" ;
		if ( !is_array( _scripts_array ) )
		{
				var _keys = _glob_js_code_projs_array.keys_associative();
				if ( is_array( _keys ) ) CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = _keys[0] ;
				_scripts_array = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		}

		var _projects_labels = is_array( _glob_js_code_projs_array ) ? _glob_js_code_projs_array.keys_associative() : [] ;
		if ( safe_size( _projects_labels, 0 ) > 0 )
		{
				var SELECTED = "" ;
				HTMLcode += "<SELECT ID=\"CIRCLESformsSCRIPTEDITORprojsCOMBO\" ONCHANGE=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerDELETEcollectedOBJS();CIRCLESformsSCRIPTEDITORprojectlabelCURRENT=$('#'+this.id+' option:selected').val();CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();\">" ;
				$.each( _projects_labels,
								function( _i, _label )
								{
										SELECTED = _label.strcmp( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ? "SELECTED=\"selected\"" : "" ;
										HTMLcode += "<OPTION "+SELECTED+" VALUE=\""+_label+"\">" + ( _label.length > 12 ? ( _label.substr( 0, 10 )+" ..." ) : _label ) ;
								}
							) ;
				HTMLcode += "</SELECT>" ;
		}
		else HTMLcode += "<SPAN STYLE=\"color:lightblue;\">No projects found</SPAN>" ;
		
		return HTMLcode ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTrename( _index, _stage, _iconsize )
{
		var _scripts_array = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
    _index = safe_int( _index, UNDET ), _stage = safe_int( _stage, 0 );
    _iconsize = safe_string( _iconsize, "20x20" );
    if ( is_array( _scripts_array ) )
    {
        if ( _stage == 0 )
        {
            var _entry_label = $( "#CIRCLESformsSCRIPTEDITORcodelistENTRY" + _index ).html();
            $( "#CIRCLESformsSCRIPTEDITORcodelistENTRY" + _index ).html( "<INPUT TYPE=\"edit\" ONKEYUP=\"javascript:CIRCLESformsSCRIPTEDITOReventsHANDLER( event, this.id, '"+_iconsize+"' );\" ID=\"CIRCLESformsSCRIPTEDITORcodelistENTRYedit"+_index+"\" VALUE=\""+_entry_label+"\" STYLE=\"width:100px;\">" );
            $( "#CIRCLESformsSCRIPTEDITORrenameICON" + _index ).prop( "src", _glob_path_to_support + "img/icons/batch/batch.icon.02."+_iconsize+".png" ) ;
            $( "#CIRCLESformsSCRIPTEDITORrenameICON" + _index ).get(0).onclick = function() { CIRCLESformsSCRIPTEDITORcodemanagerLISTrename( _index, 1, _iconsize ) ; } ;
        }
        else if ( _stage == 1 )
        {
            var _entry_label = $( "#CIRCLESformsSCRIPTEDITORcodelistENTRYedit" + _index ).val();
            _scripts_array[_index][0] = _entry_label ;
            $( "#CIRCLESformsSCRIPTEDITORcodelistENTRY" + _index ).html( _entry_label ) ;
            $( "#CIRCLESformsSCRIPTEDITORrenameICON" + _index ).prop( "src", _glob_path_to_support + "img/icons/abc/abc.icon.01."+_iconsize+".png" ) ;
            $( "#CIRCLESformsSCRIPTEDITORrenameICON" + _index ).get(0).onclick = function() { CIRCLESformsSCRIPTEDITORcodemanagerLISTrename( _index, 0, _iconsize ) ; } ;
        }
        return YES ;
    }
    else return NO ;
}

function CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay()
{
		var _keys = _glob_js_code_projs_array.keys_associative();
		if ( is_array( _keys ) && CIRCLESformsSCRIPTEDITORprojectlabelCURRENT.trim().length == 0 )
		{
				CIRCLESformsSCRIPTEDITORprojectlabelCURRENT = _keys[0] ;
				_scripts_array = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT] ;
		}

		var _proj_labels = is_array( _glob_js_code_projs_array ) ? _glob_js_code_projs_array.keys_associative() : [] ;
		var _n_projs = is_array( _proj_labels ) ? safe_size( _proj_labels, 0 ) : 0 ;
		var _scripts_array = _glob_js_code_projs_array[CIRCLESformsSCRIPTEDITORprojectlabelCURRENT], HTMLcode = "" ;
    var _n_entries = safe_size( _scripts_array, 0 ) ;
    HTMLcode = "<table WIDTH=\"100%\" BORDER=\"0\">" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
    HTMLcode += "<tr><td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td STYLE=\"color:white;\">"+( _n_projs > 0 ? _n_projs+" project"+(_n_projs==1?"":"s") : "" )+"</td><td WIDTH=\"4\"></td><td ID=\"CIRCLESformsSCRIPTEDITORlistCOMBOcontainer\">"+CIRCLESformsSCRIPTEDITORcodemanagerLISTprojectsCOMBO()+"</td>" ;
    HTMLcode += "</tr>" ;
		HTMLcode += "</table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
    HTMLcode += "<tr><td VALIGN=\"top\" ALIGN=\"right\"><table>" ;
    HTMLcode += "<tr><td WIDTH=\"5\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Add new project\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerADDproject();\" SRC=\""+_glob_path_to_img+"icons/plus/plus.icon.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Remove project\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerREMOVEproject();\" SRC=\""+_glob_path_to_img+"icons/minus/minus.icon.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Rename project\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerRENAMEproject();\" TITLE=\"Rename\" SRC=\"%root%img/icons/abc/abc.icon.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Reload project\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();\" SRC=\""+_glob_path_to_img+"icons/reload/reload.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Compile project\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEprocess();\" SRC=\""+_glob_path_to_img+"icons/gearwheel/gearwheel.icon.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Load file or proj\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORactivateLOAD();\" SRC=\""+_glob_path_to_img+"icons/bullets/bullet.down.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"4\"></td>" ;
    HTMLcode += "<td CLASS=\"link\"><IMG TITLE=\"Save project into zip\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerSAVEprojectZIPFILE();\" SRC=\""+_glob_path_to_img+"icons/zip/zip.icon.01.16x16.png\"></td>" ;
    HTMLcode += "<td WIDTH=\"8\"></td>" ;
    HTMLcode += "</tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    HTMLcode += "<tr><td WIDTH=\"5\"></td><td COLSPAN=\"11\" ID=\"CIRCLESformsSCRIPTEDITORprojectCONTAINER\"></td></tr>" ;
		HTMLcode += "</table></td></tr>" ;
    HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
    if ( _n_entries > 0 )
    {
        var ICONSIZE = "12x12", ICONside = 12 ;
				var _all_selected = circles_lib_js_manager_scripts_all_modules_selected( CIRCLESformsSCRIPTEDITORprojectlabelCURRENT ) ;
        HTMLcode += "<tr>" ;
        HTMLcode += "<td ><table><tr><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td ID=\"CIRCLESformsSCRIPTEDITORprojectlabel\" STYLE=\"color:white;\">Project <SPAN STYLE=\"color:lightblue;\">"+CIRCLESformsSCRIPTEDITORprojectlabelCURRENT+"</SPAN> includes "+_n_entries+" entr"+(_n_entries==1?"y":"ies")+"</td>" ;
        HTMLcode += "</tr></td></table>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"6\"></td></tr>" ;
        HTMLcode += "<tr><td VALIGN=\"top\"><table>" ;
        HTMLcode += "<tr><td WIDTH=\"5\"></td>" ;
        HTMLcode += "<td COLSPAN=\"12\" STYLE=\"color:yellow;\">Code compiling queue</td>" ;
        HTMLcode += "<td ALIGN=\"center\"><INPUT TYPE=\"checkbox\" "+(_all_selected?"CHECKED":"")+" ID=\"CIRCLESformsSCRIPTEDITORallCHECKBOX\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTselectALL(this.checked);\"></td>" ;
        HTMLcode += "<td></td><td COLSPAN=\"2\" STYLE=\"color:white;\" ALIGN=\"center\">All</td>" ;
        HTMLcode += "</tr>" ;
        HTMLcode += "<tr><td HEIGHT=\"4\"></td></tr>" ;
        $.each( _scripts_array,
                function( _i, _chunk )
                {
                    if ( is_array( _chunk ) )
                    {
                    		var _out_file = "", _max_length = 18 ;
                    		if ( _chunk[0].length > _max_length && _chunk[0].includes( "." ) )
                    		{
														 _out_file = _chunk[0].split( "." );
														 _out_file[0] = _out_file.from_to( 0, _chunk[0].length - 1 ).join( "" ).substr( 0, _max_length - 3 ) + "..." ;
														 _out_file = _out_file[0] + "&nbsp;" + _out_file.get_last() ; 
												}
                    		else _out_file = _chunk[0] ;
                    		var _pending = ( _chunk[0] == CIRCLESformsSCRIPTEDITORmodulelabelCURRENT && CIRCLESformsSCRIPTEDITORstatusCURRENT == PENDING ) ? 1 : 0 ;
                        HTMLcode += "<tr>" ;
                        HTMLcode += "<td WIDTH=\"5\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" STYLE=\"color:#D6E6F1;width:110px;\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTshowCODE("+_i+");\" ID=\"CIRCLESformsSCRIPTEDITORcodelistENTRY"+_i+"\">"+_out_file+"</td>" ;
                        HTMLcode += "<td WIDTH=\"5\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\"><IMG CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTrename("+_i+",0,'"+ICONSIZE+"');\" ID=\"CIRCLESformsSCRIPTEDITORrenameICON"+_i+"\" TITLE=\"Rename\" SRC=\"%root%img/icons/abc/abc.icon.01."+ICONSIZE+".png\"></td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\">"+( _i < ( _n_entries - 1 ) ? "<IMG TITLE=\"Swap down\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_js_manager_module_move( "+_i+", 'down', CIRCLESformsSCRIPTEDITORprojectlabelCURRENT );CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();\" SRC=\"%root%img/icons/arrows/single/arrow.down.01."+ICONSIZE+".png\">" : "" )+"</td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\">"+( _i > 0 ? "<IMG TITLE=\"Swap up\" CLASS=\"link\" ONCLICK=\"javascript:circles_lib_js_manager_module_move("+_i+",'up',CIRCLESformsSCRIPTEDITORprojectlabelCURRENT);CIRCLESformsSCRIPTEDITORcodemanagerLISTdisplay();\" SRC=\"%root%img/icons/arrows/single/arrow.up.01."+ICONSIZE+".png\">" : "" )+"</td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\"><IMG TITLE=\"Open\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTshowCODE( "+_i+" );\" SRC=\"%root%img/icons/eye/eye.01."+ICONSIZE+".png\"></td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\"><IMG TITLE=\"Delete\" CLASS=\"link\" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerLISTdeleteCODE( "+_i+" );\" SRC=\"%root%img/icons/delete/delete.icon."+ICONSIZE+".png\"></td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\" ALIGN=\"center\"><INPUT ID=\"CIRCLESformsSCRIPTEDITORcodeCHECKBOX"+_i+"\" TYPE=\"checkbox\" "+(_chunk[2]?"CHECKED":"")+" ONCLICK=\"javascript:CIRCLESformsSCRIPTEDITORcodemanagerCOMPILEflag( this.checked?YES:NO, "+_i+" );\"></td>" ;
                        HTMLcode += "<td WIDTH=\"4\"></td>" ;
                        HTMLcode += "<td VALIGN=\"top\" WIDTH=\""+ICONside+"\" ALIGN=\"center\" ID=\"CIRCLESformsSCRIPTEDITORstatus"+_i+"\">"+(_pending?"<IMG SRC=\""+_glob_path_to_img+"icons/unchecked/unchecked.icon.01.16x16.png\">":"")+"</td>" ;
                        HTMLcode += "<td WIDTH=\"5\"></td>" ;
                        HTMLcode += "</tr>" ;
                    }
                }
               );

        HTMLcode += "</table></td></tr>" ;
    }
    else
    {
				HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
				HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:12pt;color:white;\">Code list<br>is empty</td></tr>" ;
				HTMLcode += "<tr><td HEIGHT=\"15\"></td></tr>" ;
				HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:10pt;color:lightgray;\">You may write code and add to list<br>or load a file</td></tr>" ;
        if ( html5_files_support() )
				HTMLcode += "<tr><td ALIGN=\"center\" STYLE=\"font-size:10pt;color:lightgray;\">or drag a file over this box</td></tr>" ;
    }
    
    HTMLcode += "</table>" ;
    $( "#CIRCLESformsSCRIPTEDITORrightboxUPPER" ).html( HTMLcode.replaceAll( "%root%", _glob_path_to_support ) );
    CIRCLESformsSCRIPTEDITORboxesCONTENTStypeARRAY['rightupper'] = CIRCLESformsSCRIPTEDITORcodelistCONSTANT ;
}