<?php $PATH_TO_MENU_FILE = "settings/circles.menu.ini" ;
      $ENTRIESarray = array();
      if ( file_exists( $PATH_TO_MENU_FILE ) )
      {
          $HFILE = fopen( $PATH_TO_MENU_FILE, "r" );
          while( !feof( $HFILE ) )
          {
              $ENTRY = fgets( $HFILE );
              if ( strpos( $ENTRY, "@", 0 ) !== false )
              {
                 $ENTRY = str_replace( array( "\r\n", "\n" ), "", $ENTRY );
                 $ENTRIESarray[] = $ENTRY ;
              }
          }
           
          if ( $HFILE ) fclose( $HFILE );      
      }
?>
<?php $MENUarray = "";
      foreach( $ENTRIESarray AS $K => $CHUNK )
      {
          $CHUNKarray = explode( "@", $CHUNK );
          $KEYSarray = explode( ".", $CHUNKarray[0] );
          $V = intval( $CHUNKarray[1] );     if ( is_nan( $V ) ) $V = 0 ;
          $VALUE = $CHUNKarray[1]."@".$CHUNKarray[2]."@".$CHUNKarray[3]."@".$CHUNKarray[4]."@".$CHUNKarray[5]."@".$CHUNKarray[6] ;
          $arr = &$MENUarray ;
          while( $key = array_shift( $KEYSarray ) )
          {
              $bEXISTS = array_key_exists( $key, $arr );
              if ( !$bEXISTS ) $arr[$key] = array( $VALUE );
              $arr = &$arr[$key] ;
          }
      }
?>
<?php function optimizeMENU( &$arr, &$parent, $key, &$RET_ARRAY )
      {
          foreach( $arr AS $K => $CHUNK )
          {
              if ( is_array( $CHUNK ) )
              {
                  $_c = count( $CHUNK );
                  if ( $_c == 1 ) $RET_ARRAY[$K] = $CHUNK[0] ;
                  else
                  {
                      $RET_ARRAY[$K] = array();
                      optimizeMENU( $CHUNK, $arr, $K, $RET_ARRAY[$K] );
                  }
              }
              else $RET_ARRAY[$K] = $CHUNK ;
          }
      }
      
      $RETarray = array();
      optimizeMENU( $MENUarray, $MENUarray, 0, $RETarray );
?>
<?php function readmenu( $baseARRAY, $LEVEL, &$HTMLcode )
      {
          $_n = count( $baseARRAY );    $baseLEVEL = $LEVEL ;
          if ( $_n > 0 )
          {
              $bOPEN = 0 ;
              foreach( $baseARRAY AS $K => $CHUNK )
              {
                  $c = count( $CHUNK );
                  $isarray = ( is_array( $CHUNK ) ) ? "1" : "0" ;
                  if ( $isarray )
                  {
                      $LEVEL++ ;
                      readmenu( $CHUNK, $LEVEL, $HTMLcode );
                  }
                  else
                  {
                      $CHUNKarray = explode( "@", $CHUNK );
                      $LABEL = $CHUNKarray[0] ;
                      $CMD = $CHUNKarray[1] ;
                      $ID = $CHUNKarray[2] ;
                      $MENUentryID = $CHUNKarray[3] ;
                      $KEYsequence = $CHUNKarray[4] ;
                      $CMDONMOUSEOVER = $CHUNKarray[5] ;

                      switch( strtolower( $LABEL ) )
                      {
                          case "line":
                          $HTMLcode .= "<li STYLE=\"height:1px;margin-top:2px;margin-bottom:2px;padding:0px;background-color:#91A6B8;\"></li>" ;
                          break ;
                          case "%embeddings%":
                          case "%tools%":
                          $HTMLcode .= "$LABEL" ;
                          break ;
                          default:
                          $ONMOUSEOVER = ( $CMD || $CMDONMOUSEOVER ) ? "ONMOUSEOVER=\"javascript:this.style.cursor='pointer';$CMDONMOUSEOVER\"" : "" ;
                          $ONCLICK = $CMD ? "ONCLICK=\"javascript:$CMD\"" : "" ;
    
                          if ( $K == 0 )
                          {
                             $EVENTS = trim( ( $ONMOUSEOVER ? "$ONMOUSEOVER" : "" ).( $ONCLICK ? " $ONCLICK" : "" ) ) ;
                             $HTMLcode .= "<li $EVENTS".( $MENUentryID ? " ID=\"$MENUentryID\"" : "")."><a ID=\"anchor_$MENUentryID\">$LABEL&nbsp;&nbsp;&nbsp;$KEYsequence</a>
                                           \n<ul>" ;
                             $bOPEN = 1 ;
                          }
                          else
                          {
                             $EVENTS = trim( ( $ONMOUSEOVER ? "$ONMOUSEOVER" : "" ).( $ONCLICK ? " $ONCLICK" : "" ) ) ;
                             $HTMLcode .= "<li $EVENTS".( $MENUentryID ? " ID=\"$MENUentryID\"" : "")."><a>$LABEL&nbsp;&nbsp;&nbsp;$KEYsequence</a></li>\n" ;
                          }
                              
                          if ( $K == ( $_n - 1 ) )
                          {
                               $HTMLcode .= "</ul>\n
                                             </li>\n" ;
                               $bOPEN = 0 ;
                          }
                          break ;
                      }
                  }
              }
                
              if ( $bOPEN == 1 )
              {
                  $bOPEN = 0 ;
                  $HTMLcode .= "</ul>" ;
              }
          }
      }
?>
<?php function MENUappendENTRIES( $APPENDfilepath, $SUBSET, &$APPENDarray, &$N_FOUND )
      {
          $APPENDfilepath = trim( $APPENDfilepath );
          $RESULTSarray = strlen( $APPENDfilepath ) > 0 ? scan_folder( $APPENDfilepath, "/^.*\.(ini)$/i", 0, 1, 1, 0 ) : array();
          $N_FOUND = count( $RESULTSarray );
          if ( $N_FOUND == 0 ) return "" ;

          $HTMLcode = "<li><a>".ucfirst($SUBSET)."</a>
                       <ul>" ;

          $tmpAPPENDarray = array();
          $APPENDarray = array();
          
          foreach( $RESULTSarray AS $K => $CHUNK )
          {
               $FULLPATH = $CHUNK['fullpath'] ;
               $FOLDER = pathinfo( $FULLPATH, PATHINFO_DIRNAME );
               if ( file_exists( "$FULLPATH" ) )
               {
                   $APPEND_LOAD = get_params_ini( "INIT", "load", "$FULLPATH" );
                   if ( $APPEND_LOAD == 0 ) continue ;
                   $APPEND_BASEID = get_params_ini( "INIT", "baseid", "$FULLPATH" );
                   $APPEND_CAPTION = get_params_ini( "INIT", "caption", "$FULLPATH" );
                   $APPEND_GROUP = get_params_ini( "INIT", "group", "$FULLPATH" );
                   $APPEND_START_FN = get_params_ini( "INIT", "start.fn", "$FULLPATH" );
                   $APPEND_START_FN_PARAMS = get_params_ini( "INIT", "default.start.params", "$FULLPATH" );
                   $APPEND_JS_FILE = get_params_ini( "INIT", "file", "$FULLPATH" );
                   $APPEND_SUBSET = get_params_ini( "INIT", "subset", "$FULLPATH" );
                   $APPEND_EXEC_PRE_OPEN = trim( get_params_ini( "INIT", "exec_pre_open", "$FULLPATH" ) );
                   
                   $FOLDERPATH = pathinfo( $FULLPATH, PATHINFO_DIRNAME );
                   $FULL_JS_FILEPATH = "$FOLDERPATH/$APPEND_JS_FILE" ;
                   if ( file_exists( $FULL_JS_FILEPATH ) )
                   {
                        $CHUNK = array( "jsfile" => $FULL_JS_FILEPATH,
                                        "group" => $APPEND_GROUP,
                                        "start.fn" => $APPEND_START_FN,
                                        "default.start.params" => $APPEND_START_FN_PARAMS,
                                        "caption" => $APPEND_CAPTION,
                                        "baseid" => $APPEND_BASEID,
                                        "base" => 1,
                                        "folder" => $FOLDER,
                                        "mainfolder" => $APPENDfilepath,
                                        "exec_pre_open" => "$APPEND_EXEC_PRE_OPEN"
																			);
                              
                        $APPENDarray[] = $CHUNK ;

                        if ( $APPEND_GROUP ) $tmpAPPENDarray["$APPEND_SUBSET"]["$APPEND_GROUP"]["$APPEND_BASEID"] = $CHUNK ;
                        else $tmpAPPENDarray["$APPEND_SUBSET"]["$APPEND_BASEID"] = $CHUNK ;
                   }
               }
          }
                      
          $Nappend = count( $tmpAPPENDarray );
          if ( $Nappend > 0 )
          {
              foreach( $tmpAPPENDarray AS $SUBSET => $NODE )
              {
                  $BASE = intval( $NODE['base'] );        if ( is_nan( $BASE ) ) $BASE = 0 ;
                  if ( $BASE == 1 )
                  {
                      $APPEND_BASEID = $NODE['baseid'] ;
                      $APPEND_BASEID_CLEAN = str_replace( array( "." ), "", $APPEND_BASEID ) ;
                      $APPEND_CAPTION = $NODE['caption'] ;
                      $APPEND_EXEC_PRE_OPEN = $NODE['exec_pre_open'] ;
                      $APPEND_GROUP = $NODE['group'] ;
                      $APPEND_COMPONENT_FILE = $NODE['jsfile'] ;
                      $APPEND_FOLDER = $NODE['folder'] ;
                      $APPEND_START_FN = $NODE['start.fn'] ;
                      $APPEND_START_FN_PARAMS = $NODE['default.start.params'] ;
		                  
		                  $PARAMS_ARRAY = array( "$SUBSET", "$APPEND_BASEID" );
		                  $ADD_PARAMS_ARRAY = strlen( $APPEND_START_FN_PARAMS ) > 0 ? explode( ",", $APPEND_START_FN_PARAMS ) : array();
		                  $PARAMS_ARRAY = array_merge( $PARAMS_ARRAY, $ADD_PARAMS_ARRAY );
		                  foreach( $PARAMS_ARRAY AS $K => $DATA ) $PARAMS_ARRAY["$K"] = "'$DATA'" ;
		                  $PARAMS_STR = implode( ",", $PARAMS_ARRAY ) ;
		                  
                      $HTMLcode .= "<li ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"
                                        ONCLICK=\"javascript:".(strlen($APPEND_EXEC_PRE_OPEN)>0?"$APPEND_EXEC_PRE_OPEN;":"")."circles_lib_plugin_load($PARAMS_STR);circles_lib_menu_entries_update();\" ID=\"plugin_$APPEND_BASEID_CLEAN\"><a>$APPEND_CAPTION</a></li>
                                    <SCRIPT LANGUAGE=\"javascript\" TYPE=\"text/javascript\">_tmp_array['$APPEND_BASEID_CLEAN']='$APPEND_FOLDER';</SCRIPT>" ;
                  }
                  else MENUappendDEEPdown( $SUBSET, $NODE, $HTMLcode );
              }
          }
            
          $HTMLcode .= "</ul>
                        </li>" ;
            
          return $HTMLcode ;
      }
?>
<?php function MENUappendDEEPdown( $SUBSET, $NODE, &$HTMLcode )
      {
          foreach( $NODE AS $GROUP => $SUBNODE )
          {
              $BASE = intval( $SUBNODE['base'] );        if ( is_nan( $BASE ) ) $BASE = 0 ;
              if ( $BASE == 1 )
              {
                  $APPEND_BASEID = $SUBNODE['baseid'] ;
                  $APPEND_BASEID_CLEAN = str_replace( array( "." ), "", $APPEND_BASEID ) ;
                  $APPEND_CAPTION = $SUBNODE['caption'] ;
                  $APPEND_EXEC_PRE_OPEN = $SUBNODE['exec_pre_open'] ;
                  $APPEND_FOLDER = $SUBNODE['folder'] ;
                  $APPEND_GROUP = $SUBNODE['group'] ;
                  $APPEND_COMPONENT_FILE = $SUBNODE['jsfile'] ;
                  $APPEND_START_FN = $SUBNODE['start.fn'] ;
                  $APPEND_START_FN_PARAMS = $SUBNODE['default.start.params'] ;
		                  
                  $PARAMS_ARRAY = array( "$SUBSET", "$APPEND_BASEID" );
                  $ADD_PARAMS_ARRAY = strlen( $APPEND_START_FN_PARAMS ) > 0 ? explode( ",", $APPEND_START_FN_PARAMS ) : array();
                  $PARAMS_ARRAY = array_merge( $PARAMS_ARRAY, $ADD_PARAMS_ARRAY );
                  foreach( $PARAMS_ARRAY AS $K => $DATA ) $PARAMS_ARRAY["$K"] = "'$DATA'" ;
                  $PARAMS_STR = implode( ",", $PARAMS_ARRAY ) ;
		                  
                  $HTMLcode .= "<li ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"
                                    ONCLICK=\"javascript:".(strlen($APPEND_EXEC_PRE_OPEN)>0?"$APPEND_EXEC_PRE_OPEN;":"")."circles_lib_plugin_load($PARAMS_STR);circles_lib_menu_entries_update();\" ID=\"plugin_$APPEND_BASEID_CLEAN\"><a>$APPEND_CAPTION</a></li>" ;
                  $HTMLcode .= "<SCRIPT LANGUAGE=\"javascript\" TYPE=\"text/javascript\">_tmp_array['$APPEND_BASEID_CLEAN']='$APPEND_FOLDER';</SCRIPT>" ;
              }
              else if ( $BASE == 0 )
              {
                  $HTMLcode .= "<li><a>$GROUP</a>
                                <ul>" ;
                  MENUappendDEEPdown( $SUBSET, $SUBNODE, $HTMLcode );
                  $HTMLcode .= "</ul>" ;
              }
          }
      }
?>
<div class="example" ID="menu">
<ul id="nav" ALIGN="left">
<?php readmenu( $RETarray, -1, $HTMLcode );
			$EXT_FILES = array();
			$FOLDERS = scan_folder( "plugins/", "", 0, 0, 0, 1 ) ;
			foreach( $FOLDERS AS $SUBSET_CHUNK )
			{
					$SUBSET = strtolower( $SUBSET_CHUNK['filename'] ) ;
					if ( strcmp( $SUBSET, "forms" ) != 0 )
					{
							$SUPPORT_FILES = scan_folder( "plugins/$SUBSET", "/^.*\.(support\.lib\.js)$/i", 0, 1, 1, 0 ) ;
							foreach( $SUPPORT_FILES AS $CHUNK ) $EXT_FILES[] = $CHUNK['fullpath'] ;

				      $SUBSETmenuCODE = MENUappendENTRIES( "plugins/$SUBSET/", $SUBSET, $SUBSETarray, $N_FOUND );
				      if ( $N_FOUND > 0 ) $HTMLcode = str_replace( "%$SUBSET%", $SUBSETmenuCODE, $HTMLcode );
				      else $HTMLcode = str_replace( "%$SUBSET%", "<a STYLE=\"color:gray;\">No gens registered</a>", $HTMLcode );
					}
			}
			
      echo $HTMLcode ;
?>
</ul>
</div>
<?php foreach( $EXT_FILES AS $EXT_FILE )
			{
		      if ( strlen( $EXT_FILE ) > 0 && file_exists( $EXT_FILE ) ) echo "<SCRIPT LANGUAGE=\"javascript\" TYPE=\"text/javascript\" SRC=\"$EXT_FILE\"></SCRIPT>" ;
			}
?>