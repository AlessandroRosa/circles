<?php function folder_map( $FOLDERroot, $LOCKlevelAT, $FOLDERmapRECURSION, &$FILES_COUNT )
      {
					 if ( $LOCKlevelAT == 0 ) $LOCKlevelAT = 1 ;
           $HTMLcode = "" ;
           
           $GET_FOLDER = $_GET['folder'] ;
           $GET_FOLDER_ARRAY = explode( "/", $GET_FOLDER );
           $COUNT_GET_FOLDER = count( $GET_FOLDER_ARRAY );
           $LAST_ITEM_GET_FOLDER = $GET_FOLDER_ARRAY[$COUNT_GET_FOLDER-1] ;
           $LAST_ITEM_GET_PARENT = $GET_FOLDER_ARRAY[$COUNT_GET_FOLDER-2] ;

           $FILES = scandir( "$FOLDERroot" );
           $FILES_COUNT = count( $FILES );
           
           $copyROOT = $FOLDERroot ;

           $LEVEL = count( explode( "/", "$copyROOT" ) ) ;
           $LEVEL-- ;
           $COLS = 5 ;
           foreach( $FILES AS $K => $F )
           if ( $F == "." || $F == ".." || strpos( strtolower( $F ), ".php", 0 ) !== false ) unset( $FILES["$K"] );
           
           $FILES_COUNT = count( $FILES );

                  if ( $FILES_COUNT > 0 && $LEVEL < $LOCKlevelAT )
                  {
                       $HTMLcode .= "<table cellpadding=0 cellspacing=0 valign=\"top\">" ;
                       $CNT = 0 ;     

                             foreach( $FILES AS $K => $F )
                             {
                                  $candidateFOLDER = ( $copyROOT != "." ) ? "$copyROOT/$F" : "$F" ;
                                  $candidateFOLDER = str_replace( "//", "/", $candidateFOLDER );
                                  $candidatePARENTarray = explode( "/", $candidateFOLDER );
                                  $CPA = count( $candidatePARENTarray ) ;
                                  $candidatePARENT = $candidatePARENTarray[ count( $candidatePARENTarray ) - 2 ] ;
                                  $candidateFOLDER = str_replace( "//", "/", $candidateFOLDER );
                                  $IS_DIR = ( is_dir( "$candidateFOLDER" ) ) ? 1 : 0 ;
                                  
                                  if ( $IS_DIR )
                                  {
                                       $INIPATH = ( strcmp( $copyROOT, "." ) == 0 ? "" : "$copyROOT" )."$F/folder.ini" ;
                                       $LABEL = file_exists( $INIPATH ) ? get_params_ini( "FOLDER", "label", $INIPATH ) : "(Unknown ref)" ;
                                       
                                       $SELECTED = ( strcmp( $LAST_ITEM_GET_PARENT, $candidatePARENT ) == 0 && strcmp( $F, $LAST_ITEM_GET_FOLDER ) == 0 ) ? 1 : 0 ;
                                       $boldIN = ( $SELECTED ) ? "<b STYLE=\"color:#434343;font-size:10pt;\">" : "" ;
                                       $boldOUT = ( $SELECTED ) ? "</b>" : "" ;
                                       
                                       $F_OUT = str_replace( array( ".", "-" ), " ", $F );
                                       $F_OUT = ucfirst( $F_OUT );
                                       $HTMLcode .= "<tr>
                                                     <td VALIGN=\"top\" WIDTH=\"1\"></td>
                                                     <td VALIGN=\"top\" WIDTH=\"1\" CLASS=\"general_rounded_corners\" STYLE=\"background-color:".( $SELECTED ? "#A2A2E0" : "#DCDCF7" ).";\"></td>
                                                     <td VALIGN=\"top\" WIDTH=\"1\"></td>
                                                     <td VALIGN=\"top\" ".( $SELECTED ? "ID=\"TREEleafSELECTED\"" : "" ).">
                                                     <table cellpadding=0 cellspacing=0 valign=\"top\" BORDER=\"0\">
                                                     <tr>
                                                         <td VALIGN=\"top\" STYLE=\"padding-top:4px;\"><IMG SRC=\"".$GLOBALS['PATH_TO_IMG']."icons/bullets/bullet.left.blue.02.8x8.png\"></td>
                                                         <td STYLE=\"font-weight:bold;\"><A STYLE=\"color:#5BAAE7;\" HREF=\"?folder=$candidateFOLDER&lockat=$LOCKlevelAT\">$boldIN$LABEL$boldOUT</A></td>
                                                     </tr>
                                                     <tr><td HEIGHT=\"2\"></td></tr>" ;
                                                     
                                       if ( $FOLDERmapRECURSION )
                                       {
                                            $newCODE = folder_map( "$candidateFOLDER/", $LOCKlevelAT + 1, $FOLDERmapRECURSION, $ITEMS_COUNT ) ;
                                            if ( $ITEMS_COUNT > 0 )
                                            $HTMLcode .= "<tr><td></td>
                                                              <td VALIGN=\"top\" COLSPAN=\"$FILES_COUNT\">$newCODE</td></tr>
                                                          <tr><td HEIGHT=\"5\"></td></tr>" ;
                                       }
                                       
                                       $HTMLcode .= "</table>
                                                     </td>
                                                     </tr>
                                                     <tr><td HEIGHT=\"1\"></td></tr>" ;
                                  }
                             }

                       $HTMLcode .= "</table>" ;
                                     
                                     return $HTMLcode ;
                  }
      }