<?php
define("LATIN1_UC_CHARS", "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ");
define("LATIN1_LC_CHARS", "àáâãäåæçèéêëìíîïðñòóôõöøùúûüý");

function split_into_chunks_of_given_length( $STR, $ARRAY_OF_LENGTHS )
{
    $CHUNKSarray = array();
          
    $C = count( $ARRAY_OF_LENGTHS );
    $STRLEN = strlen( $STR );
    if ( $C > 0 && $STRLEN > 0 )
    {
       $STARTpointer = 0 ;
       foreach( $ARRAY_OF_LENGTHS AS $K => $LEN )
       {
          $LEN = intval( $LEN );
          $ENDpointer = min( $STARTpointer + $LEN, $STRLEN ) ;
          if ( ( $STARTpointer + $LEN ) <= $STRLEN ) $CHUNKSarray[] = substr( $STR, $STARTpointer, $LEN ) ;
          $STARTpointer = $ENDpointer;
       }
               
       return $CHUNKSarray ;
    }
    else return array() ;
}
      
function scan_folder( $root, $REG_MATCH_PATTERN, $inc_file_data = 0, $recursive = 1 )
{
	  $root = rtrim( $root, '\\/' );
		if ( !is_dir( $root ) ) return array() ;
	  $result = array() ;
	  $filepath = "" ;

	  foreach( scandir( $root ) as $f )
	  {
	     if( $f !== '.' && $f !== '..' )
	     {
	     		$filepath = str_replace( "//", "/", "$root/$f" ) ;
	        if ( is_dir( $filepath ) )
	        {
		        	if ( $recursive )
		          $result = array_merge($result, scan_folder( "$root/$f", $REG_MATCH_PATTERN, $inc_file_data, $recursive ) );
	        }
	        
	        $bGO = strlen( $REG_MATCH_PATTERN ) == 0 ? 1 : ( preg_match( $REG_MATCH_PATTERN, $f, $MATCHES ) ? 1 : 0 ) ;
					if ( $bGO )
	        {
		          $chunk = array( "fullpath" => "$root/$f",
		                          "filename" => $f,
		                          "time" => date ("M d Y H:i:s", filemtime($root."/".$f) ),
		                          "contents" => ( $inc_file_data ? file_get_contents( "$root/$f" ) : "" )
		                        );
		          $result[] = $chunk ;
	        }
	     }
	  }
	
	  return $result;
}

function check_login_authorized()
{
    $bACCESS = true ;
    if ( !CookieExists( "CookieUSERID" ) ||
         !CookieExists( "CookieLOGIN" ) ||
         strcmp( strtoupper( GetCookie( "CookieAPPLICATION" ) ), "PROSPECT" ) != 0 ||
         intval( GetCookie( "CookieLOGIN" ) ) == 0
    ) $bACCESS = false ;

    return $bACCESS ;
}

function process_array( $ARRAY,
                        $bTRIM = true,
                        $bSTRIPDOUBLESPACES = true,
                        $bURLDECODE = true,
                        $bSTRIPSLASHES = true,
                        $bTOUPPERCASE = true )
{
    // elimina eventuali (doppi) spazi, slashes e decodifica url
    $OUTarray = array();
    foreach( $ARRAY AS $KEY => $VALUE )
    {
        $KEY = trim( $KEY );
        if ( $bTRIM ) $VALUE = trim( $VALUE );
        if ( $bSTRIPDOUBLESPACES ) $VALUE = preg_replace('/\s{2,}/',' ', $VALUE );
        if ( $bURLDECODE ) $VALUE = urldecode( $VALUE );
        if ( $bSTRIPSLASHES ) $VALUE = stripslashes( $VALUE );
        if ( $bTOUPPERCASE ) $VALUE = strtoupper( $VALUE );
        $OUTarray["$KEY"] = $VALUE ;
    }
            
    return $OUTarray ;
}

function countWeekdaysDuringInterval($startDate, $endDate, $weekdayNumber, &$howmany )
{     
      $startDate = strtotime($startDate);     
      $endDate = strtotime($endDate);      
	    $dateArr = array();
      
      do
      {         
          if( date( "w", $startDate ) != $weekdayNumber )         
          $startDate += (24 * 3600); // add 1 day         
      }
      while( date( "w", $startDate ) != $weekdayNumber );       
      
      while($startDate <= $endDate)
      {         
          $dateArr[] = date('Y-m-d', $startDate);         
          $startDate += (7 * 24 * 3600); // add 7 days
      }
      
      $howmany = count( $dateArr );       if ( is_nan( $howmany ) ) $howmany = 0 ;

      return($dateArr); 
} 

function lastday($month = '', $year = '')
{
    if ( empty( $month ) ) $month = date('m');
    if ( empty( $year ) ) $year = date('Y');
    $result = strtotime( '{$year}-{$month}-01' );
    $result = strtotime( '-1 second', strtotime( '+1 month', $result ) ) ;
    return date( 'Y-m-d', $result );
}

function is_italian_date_format( $d ) { return preg_match( "/([0-9]{2})-([0-9]{2})-([0-9]{4})/", $d ) ; }
function is_english_date_format( $d ) { return preg_match( "/([0-9]{4})-([0-9]{2})-([0-9]{2})/", $d ) ; }

function load_src_code_dir( $PATHtoSOURCEcode, $EXTENSIONS, &$ERRCODE, $bRECURSIVE = true, $EXCEPTIONSarray = array() )
{
      $EXTENSIONSarray = ( strpos( $EXTENSIONS, "|", 0 ) !== false ) ? explode( "|", $EXTENSIONS ) : array( "$EXTENSIONS" );
      $Nexceptions = count( $EXCEPTIONSarray ) ;
      // quick path checking ...
      $PATHtoSOURCEcode = trim( $PATHtoSOURCEcode );
      if ( substr( $PATHtoSOURCEcode, -1 ) != "/" ) $PATHtoSOURCEcode .= "/" ;
      
      if ( file_exists( $PATHtoSOURCEcode ) )
      {
          $FILESarray = scandir( $PATHtoSOURCEcode );
          $N = count( $FILESarray );
          if ( $N == 0 ) $ERRCODE = 1 ;
          else
          {
              foreach( $FILESarray AS $KEY => $FILE )
              {
                  if ( strcmp( $FILE, "." ) != 0 && strcmp( $FILE, ".." ) != 0 )
                  {
                      if ( is_file( "$PATHtoSOURCEcode$FILE" ) )
                      {
                          if ( $Nexceptions > 0 )
                          {
                              $bEXCEPTION = in_array( $PATHtoSOURCEcode, $EXCEPTIONSarray ) || in_array( $FILE, $EXCEPTIONSarray ) ;
                              if ( $bEXCEPTION ) continue ;
                          }

                          $CANDIDATEextension = pathinfo( $FILE, PATHINFO_EXTENSION ) ;
                          if ( in_array( "$CANDIDATEextension", $EXTENSIONSarray ) )
                          {
                               switch( "$CANDIDATEextension" )
                               {
                                      case "js":
                                          echo "<SCRIPT LANGUAGE=\"javascript\" TYPE=\"text/javascript\" SRC=\"$PATHtoSOURCEcode$FILE\"></SCRIPT>\r\n" ;
                                      break ;
                                      case "php":
                                          @require_once( "$PATHtoSOURCEcode$FILE" ) ;
                                      break ;
                                      case "css":
                                          echo "<STYLE TYPE=\"text/css\">@import url( '$PATHtoSOURCEcode$FILE');</STYLE>\r\n" ;
                                      break ;
                               }
                          }
                      }
                      else if ( is_dir( "$PATHtoSOURCEcode$FILE" ) && $bRECURSIVE )
                      {
                          if ( $Nexceptions > 0 )
                          {
                              $bEXCEPTION = in_array( $PATHtoSOURCEcode, $EXCEPTIONSarray ) || in_array( $FILE, $EXCEPTIONSarray ) ;
                              if ( $bEXCEPTION ) continue ;
                          }

                          load_src_code_dir( "$PATHtoSOURCEcode$FILE", $EXTENSIONS, $ERRCODE, $bRECURSIVE, $EXCEPTIONSarray );
                      }
                  }
              }
          }
      }
      else $ERRCODE = 1 ;
}

function basic_require_array( &$REQarray )
{
      $bRUN = true ;
      $REQarray = array();
      
      foreach( $req_files as $req )
      {
            if ( file_exists( $req ) ) @require_once( $req );
            else
            {
                 $bRUN &= false ;
                 $REQarray[] = $req ;
            }
      }
      
      return $bRUN ;
}

function get_string_between($string, $start, $end, $startpos, &$endpos )
{
    $string = " ".$string ;
    $ini = stripos($string,$start, $startpos) ;
    if ($ini == 0) return "" ;
    $ini += strlen($start) ;
    $endpos = stripos($string,$end,$ini) ;
    $endpos += strlen($end) ;
    $len = $endpos - $ini - strlen($end) ;
    return substr($string,$ini,$len);
}

function fullUpper($str) {
    $str = strtoupper(strtr($str, LATIN1_LC_CHARS, LATIN1_UC_CHARS));
    return strtr($str, array("ß" => "SS"));
}

function strip_tags_only($str, $tags) {
    if(!is_array($tags)) {
        $tags = (strpos($str, '>') !== false ? explode('>', str_replace('<', '', $tags)) : array($tags));
        if(end($tags) == '') array_pop($tags);
    }
    foreach($tags as $tag) $str = preg_replace('#</?'.$tag.'[^>]*>#is', '', $str);
    return $str;
}

function roundNumber( $val, $decimals, $decimalSEPARATOR, $thousandsSEPARATOR )
{
    $val = floatval( $val );
    $val = round( $val, $decimals );
    
    return number_format( $val, $decimals, $decimalSEPARATOR, $thousandsSEPARATOR );
}

function format_decimals( $str, $number_of_chars_per_decimals, $decimal_separator )
{
      $number_of_chars_per_decimals = intval( $number_of_chars_per_decimals );
      $len = strlen( $str );
      $number_of_chars_per_integers = $len - $number_of_chars_per_decimals ;
      $number_of_chars_per_integers = max( 0, $number_of_chars_per_integers );
      
      if ( $len > 0 && $number_of_chars_per_integers > 0 && $number_of_chars_per_decimals > 0 )
      {
           $out = substr( $str, 0, $number_of_chars_per_integers ) ;
           $out .= "$decimal_separator" ;
           $out .= substr( $str, -$number_of_chars_per_decimals, $number_of_chars_per_decimals ) ;
           $str = $out ;
      }
      
      return $str ;
}

function validate_datetime_format( $datetimeFMT, $NATION = "it" )
{
    if ( empty( $NATION ) || strlen( $NATION ) == 0 ) $NATION = "it" ;
    
    $datetimeFMTarray = split( " ", $datetimeFMT );
    $dateFMT = $datetimeFMTarray[0] ;
    $timeFMT = $datetimeFMTarray[1] ;

    $dateFMT = validate_date_format( $dateFMT, $NATION ) ;
    
    return "$dateFMT $timeFMT" ;
}

function validate_date_format( $dateFMT, $NATION = "it" )
{
    if ( empty( $NATION ) || strlen( $NATION ) == 0 ) $NATION = "it" ;

    $dateFMT = str_replace( "/", "-", $dateFMT );
    if ( $dateFMT == '0000-00-00' || $dateFMT == '00-00-0000' ) return "" ;

    if ( preg_match( "/([0-9]{2})-([0-9]{2})-([0-9]{4})/", $dateFMT ) )
    {
          $d = explode( "-", $dateFMT );
          return $d[2]."-".$d[1]."-".$d[0] ;
    }
    
    if ( preg_match( "/([0-9]{4})-([0-9]{2})-([0-9]{2})/", $dateFMT ) )
    {
          $d = explode( "-", $dateFMT );
          return $d[2]."-".$d[1]."-".$d[0] ;
    }
}

function get_file_size( $filename )
{
    if ( file_exists( "$filename" ) )
    {
        $a = fopen($filename, 'r'); 
        fseek($a, 0, SEEK_END); 
        $filesize = ftell($a); 
        fclose($a); 
        
        return $filesize ;
    }
    else return false ;
}

function flushINTOfile( $filename, $contents )
{
    if ( ( $HFILE = fopen( "$filename", "w+" ) ) === false ) return false ;
    fwrite( $HFILE, $contents );
    $bCLOSED = fclose( $HFILE );
    return $bCLOSED ;
}

function is_empty( $in )  { return ( !isset( $in ) || strlen( $in ) == 0 ) ? 1 : 0 ; }

function check_repair( $connessione )
{
          $SQLquerySHOWTABLES = "SHOW TABLES" ;
          $HquerySHOWTABLES = @mysql_query( $SQLquerySHOWTABLES, $connessione );
          if ( $HquerySHOWTABLES !== false && mysql_error() == 0 )
          {
              while( $entrySHOWTABLES = mysql_fetch_row( $HquerySHOWTABLES ) )
              {
                  $TABLE = $entrySHOWTABLES[0] ;
                  if ( $TABLE )
                  {
                      $SQLqueryCHECK = "CHECK TABLE $TABLE ;" ;
                      $HqueryCHECK = @mysql_query( $SQLqueryCHECK, $connessione );

                      if ( $HqueryCHECK !== false && mysql_error() == 0 )
                      {
                          $entryCHECK = mysql_fetch_row( $HqueryCHECK );
                          
                          $RESPONSE = strtoupper( $entryCHECK[3] ) ;

                          if ( strcmp( strtoupper( $RESPONSE ), "OK" ) != 0 )
                          {
                              $SQLqueryREPAIR = "REPAIR TABLE $TABLE" ;
                              $HqueryREPAIR = @mysql_query( $SQLqueryREPAIR, $connessione );
                              
                              check_repair( $connessione );
                          }
                      }
                  }
              }
          }
}

function explodePACKEDarray( $PACKEDarrayIN, $LEFTdelimiter, $RIGHTdelimiter, &$arrayOUT )
{
    if ( strlen( $PACKEDarrayIN ) == 0 || ( strlen( $LEFTdelimiter ) == 0 && strlen( $RIGHTdelimiter ) == 0 ) ) { $arrayOUT = array(); return false ; }
    else
    {
         if ( $LEFTdelimiter ) $PACKEDarrayIN = str_replace( $RIGHTdelimiter, "", $PACKEDarrayIN );
         else if ( $RIGHTdelimiter ) $PACKEDarrayIN = str_replace( $LEFTdelimiter, "", $PACKEDarrayIN );
         
         if ( $LEFTdelimiter ) $arrayOUT = explode( "$LEFTdelimiter", $PACKEDarrayIN );
         else if ( $RIGHTdelimiter ) $arrayOUT = explode( "$RIGHTdelimiter", $PACKEDarrayIN );
         
         // clean fake entries
         foreach( $arrayOUT AS $KEY => $VALUE )
         {
              if ( strlen( $VALUE ) == 0 ) unset( $arrayOUT["$KEY"] );
         }
         
         $tmpOUTarray = array();
         foreach( $arrayOUT AS $KEY => $VALUE ) $tmpOUTarray[] = $VALUE ;
         
         $arrayOUT = $tmpOUTarray ;
         
         return true ;
    }
}

function implodePACKEDarray( $arrayIN, $LEFTdelimiter, $RIGHTdelimiter, &$stringOUT )
{
    if ( count( $arrayIN ) == 0 || ( strlen( $LEFTdelimiter ) == 0 && strlen( $RIGHTdelimiter ) == 0 ) ) { $stringOUT = "" ; return false ; }
    else if ( is_array( $arrayIN ) )
    {
         $stringOUT = "" ;
         foreach( $arrayIN AS $KEY => $VALUE ) $stringOUT .= "$LEFTdelimiter$VALUE$RIGHTdelimiter" ;

         return true ;
    }
    else return false ;
}

function optimizeALLtables( $connessione )
{
          $SQLquery = "SHOW TABLES;" ;
          $Hquery = mysql_query ( $SQLquery, $connessione );
          
          while( $entry = mysql_fetch_array( $Hquery ) )
          {
              $nomeTABELLA = $entry[0] ;
              if ( $nomeTABELLA )
              {
                  $SQLquery1 = "OPTIMIZE TABLE $nomeTABELLA ;" ;
                  $Hquery1 = mysql_query ( $SQLquery1, $connessione );
              }
          }
}

function mkdir_recursive($pathname, $mode)
{
    is_dir(dirname($pathname)) || mkdir_recursive(dirname($pathname), $mode);
    return is_dir($pathname) || @mkdir($pathname, $mode);
}

function copy_recursive( $source, $dest, &$FAILED = 0, $onlyfiles = false )
{
    // recursive function to copy     
    // all subdirectories and contents:     
    if( is_dir( $source ) )
    {         
          $dir_handle = opendir($source);         
          $sourcefolder = basename($source);
          $DEST_FOLDER = ( $onlyfiles ) ? $dest."/" : $dest."/".$sourcefolder ;
          if ( !file_exists( $dest."/".$sourcefolder ) ) mkdir_recursive( $DEST_FOLDER, 0755 );

          while($file=readdir($dir_handle))
          {             
                if( $file != "." && $file != ".." )
                {                 
                      if( is_dir( $source."/".$file ) )
                      {                     
                            copy_recursive($source."/".$file, $DEST_FOLDER, $FAILED, $onlyfiles );                 
                      }
                      else
                      {     
                            $SRC = $source."/".$file ;
                            $DEST = $DEST_FOLDER."/".$file ;
                            $bCOPY = copy( $SRC, $DEST );
                            
                            if ( !$bCOPY ) $FAILED++ ;                 
                      }
                }         
          }         
          
          closedir($dir_handle);     
      }
      else
      {         
          // can also handle simple copy commands         
          copy_recursive($source, $dest, $FAILED, $onlyfiles );
      }
      
      return true ;
}

function rrmdir( $dir )
{
    foreach( glob( $dir . '/*' ) as $file )
    {
        if ( is_dir( $file ) ) rrmdir( $file );
        else @unlink( $file );
    }
    
    @rmdir( $dir );
}

function unlinkRecursive( $dir, $deleteFolder, $bREPORT = false, &$_glob_counter, &$_glob_FILESCNT, &$ERRarray = array() )
{
    if( !$dh = @opendir( $dir ) )
    {
        return false ;
    }
    
    $FILESCNT = 0 ;
    
    while (false !== ($obj = readdir($dh)))
    {
        if( $obj == '.' || $obj == '..' ) continue;

        if ( !is_dir( $dir . '/' . $obj ) )
        {
            $FILESCNT++ ;
            $_glob_FILESCNT++ ;
        }

        if ( !@unlink( $dir . '/' . $obj ) )
        {
            unlinkRecursive($dir.'/'.$obj, $deleteFolder, $bREPORT, $_glob_counter, $_glob_FILESCNT );
        }
    }

    closedir( $dh );

            if ( $bREPORT )
            {
                $DIR = str_replace( "//", "/", "$dir/$obj" );
                
                $BKCOLOR = "" ;
                
                switch( ( $_glob_counter % 2 ) )
                {
                      case 0: $BKCOLOR = "#D0E8D9" ; break ;
                      case 1: $BKCOLOR = "#DBECF3" ; break ;
                }
                
                echo "<tr>
                          <td WIDTH=\"10\" HEIGHT=\"18\"
                              STYLE=\"padding-top:1px;
                                      padding-left:4px;
                                      background-color:$BKCOLOR;\"
                              ONCLICK=\"javascript:window.open('$DIR', '', '');\"
                              ONMOUSEOVER=\"javascript:this.style.cursor='pointer';\"
                              ALIGN=\"center\"><IMG SRC=\"img/icons/bullets/bullet.blue.20x20.png\"></td>
                          <td WIDTH=\"1\" STYLE=\"background-color:white;\"></td>
                          <td ONCLICK=\"javascript:window.open('$DIR', '', '');\"
                              ONMOUSEOVER=\"javascript:this.style.cursor='pointer';this.style.textDecoration='underline';\"
                              ONMOUSEOUT=\"javascript:this.style.cursor='pointer';this.style.textDecoration='none';\"
                              STYLE=\"background-color:$BKCOLOR;
                                      padding-left:5px;
                                      padding-right:10px;
                                      font-size:8pt;
                                      font-family:arial;\">$DIR</td>
                          <td WIDTH=\"1\" STYLE=\"background-color:white;\"></td>
                          <td WIDTH=\"50\"
                              STYLE=\"padding-left:5px;
                                      background-color:$BKCOLOR;
                                      font-size:8pt;
                                      font-family:arial;\">Ripulita</td>
                          <td WIDTH=\"1\" STYLE=\"background-color:white;\"></td>
                          <td STYLE=\"padding-left:5px;
                                      background-color:$BKCOLOR;
                                      font-size:8pt;
                                      font-family:arial;\">$FILESCNT ".( ( $FILESCNT == 1 ) ? "file rimosso" : "files rimossi" )."</td>
                          <td STYLE=\"background-color:$BKCOLOR;\"
                              WIDTH=\"6\"></td>
                      </tr>
                      <tr><td HEIGHT=\"1\"></td></tr>" ;
                      
                      $_glob_counter++ ;
                
                flush();    ob_flush();
            }
   
    if ( $deleteFolder )
    {
        $bREMOVED = @rmdir( $dir );
        if ( !$bREMOVED ) $ERRarray = error_get_last() ;

                if ( $bREMOVED && $bREPORT )
                echo "<tr>
                          <td STYLE=\"padding-top:1px;\"
                              WIDTH=\"10\" ALIGN=\"center\"><IMG SRC=\"img/icons/bullets/bullet.blue.20x20.png\"></td>
                          <td WIDTH=\"5\"></td>
                          <td STYLE=\"font-size:8pt;
                                      font-family:arial;\">Cartella</td>
                          <td WIDTH=\"5\"></td>
                          <td STYLE=\"font-size:8pt;
                                      font-family:arial;\">$dir</td>
                          <td WIDTH=\"5\"></td>
                          <td STYLE=\"font-size:8pt;
                                      font-family:arial;\">eliminata</td>
                      </tr>
                      <tr><td HEIGHT=\"2\"></td></tr>" ;
                
                flush();    ob_flush();
                
          return $bREMOVED ;
    }
    else return true;
}

function get_last_char( $STR, &$LASTCHR )
{
    if ( strlen( $STR ) == 0 )
    {
        $LASTCHR = "" ;
        return false ;
    }
    else
    {
        $LASTCHR = substr( $STR, -1 );
        return true ;
    }
}

function strip_doublespaces( $str )
{
    $pat[0] = "/^\s+/" ;            $rep[0] = "" ;
    $pat[1] = "/\s{2,}/" ;          $rep[1] = " " ;
    $pat[2] = "/\s+\$/" ;           $rep[2] = "" ;
    $pat[3] = "/[\r\n]+/" ;         $rep[3] = "" ;
    $pat[4] = "/[\n]+/" ;           $rep[4] = "" ;
                 
    $str = preg_replace( $pat, $rep, $str ) ;
    return $str ;
}

function formatMEMsize( $bytes )
{
    $bytes = intval( $bytes );

    $KbONE = 1024 ;
    $MbONE = $KbONE * $KbONE ;

    $KBS = round( $bytes / $KbONE, 2 ) ;      if ( is_nan( $KBS ) ) $KBS = 0 ; 
    if ( $KBS < 800 )
    {
        $measure = "Kb" ;
    }
    else
    {
        $KBS = round( $bytes / $MbONE, 2 ) ;      if ( is_nan( $KBS ) ) $KBS = 0 ;
        $measure = "Mb" ;
    }

    $mem = $KBS ;
    return "$mem $measure" ;
}

function count_files( $dir )
{
     $N = ( file_exists( $dir ) ) ? count( scandir( $dir ) ) - 2 : 0 ; // removes 2 entries : "." and ".."
     if ( is_nan( $N ) ) $N = 0 ;      $N = max( 0, $N ) ;    // prevents any illegal value
     return $N ;
}

function replace_accents( $inSTR )
{
      $inSTR = str_replace( "à", "a", $inSTR );
      $inSTR = str_replace( array( "è", "é" ), "e", $inSTR );
      $inSTR = str_replace( "ì", "i", $inSTR );
      $inSTR = str_replace( "ò", "o", $inSTR );
      $inSTR = str_replace( "ù", "u", $inSTR );
      
      return $inSTR ;
}

function encode_accents( $inSTR )
{
      $inSTR = str_replace( "à", "&aacute;", $inSTR );
      $inSTR = str_replace( "è", "&eacute;", $inSTR );
      $inSTR = str_replace( "é", "&egrave;", $inSTR );
      $inSTR = str_replace( "ì", "&iacute;", $inSTR );
      $inSTR = str_replace( "ò", "&oacute;", $inSTR );
      $inSTR = str_replace( "ù", "&uacute;", $inSTR );
      
      return $inSTR ;
}

function decode_accents( $inSTR )
{
      $inSTR = str_replace( "&aacute;", "à", $inSTR );
      $inSTR = str_replace( "&eacute;", "è", $inSTR );
      $inSTR = str_replace( "&egrave;", "é", $inSTR );
      $inSTR = str_replace( "&iacute;", "ì", $inSTR );
      $inSTR = str_replace( "&oacute;", "ò", $inSTR );
      $inSTR = str_replace( "&uacute;", "ù", $inSTR );
      
      return $inSTR ;
}

function split_phonenumber( $FULLnumber, &$prefix, &$number )
{
      if ( $FULLnumber )
      {
          $FULLnumber = str_replace( ".", "-", $FULLnumber );
          $FULLnumber = str_replace( "/", "-", $FULLnumber );
          
          if ( strpos( $FULLnumber, "-", 0 ) !== false )
          {
              $PHONEarray = explode( "-", $FULLnumber );
              $Nelements = count( $PHONEarray ) ;

              if ( $Nelements == 2 )
              {
                  $prefix = $PHONEarray[0] ;
                  $number = $PHONEarray[1] ;
              }
              else if ( $Nelements == 0 )
              {
                  $prefix = "" ;
                  $number = "" ;
              }

              return true ;
          }
          else
          {
                if ( $FULLnumber <= 4 ) $prefix = $FULLnumber ;
                else $number = $FULLnumber ;
          }
          
          
          return false ;    
      }
      else return false ;
}

function KeyName(array $a, $pos)
{
    $temp = array_slice($a, $pos, 1, true);
    return key($temp);
}

function GetElement(array $a, $pos)
{
    $temp = array_slice($a, $pos, 1, true);
    return $temp[0] ;
}

function get_full_url()
{
    $s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
    $sp = strtolower($_SERVER["SERVER_PROTOCOL"]);
    $protocol = substr($sp, 0, strpos($sp, "/")) . $s;
    $port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":".$_SERVER["SERVER_PORT"]);
    return $protocol . "://" . $_SERVER['SERVER_NAME'] . $port . $_SERVER['REQUEST_URI'];
}

function get_remote_ip()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
      $ip=$_SERVER['REMOTE_ADDR'];
    }

    return $ip;
}

function utf8_die_encode( $TEXT ) { die( utf8_encode( $TEXT ) ) ; }
function utf8_die_decode( $TEXT ) { die( utf8_decode( $TEXT ) ) ; }

function calcola_eta( $DATA_NASCITA, $DATA_OGGI ) // le date devono essere inserite come GG-MM-AAAA
{
    $ETA = 0 ;
    
    if ( strpos( $DATA_NASCITA, "-", 0 ) === false || strpos( $DATA_OGGI, "-", 0 ) === false ) return -1 ;
    else
    {
         $NASCITAarray = explode( "-", $DATA_NASCITA );       $OGGIarray = explode( "-", $DATA_OGGI );
         
         $NASCITA_GG = intval( $NASCITAarray[0] );    $NASCITA_MM = intval( $NASCITAarray[1] );   $NASCITA_AAAA = intval( $NASCITAarray[2] );
         $OGGI_GG = intval( $OGGIarray[0] );          $OGGI_MM = intval( $OGGIarray[1] );         $OGGI_AAAA = intval( $OGGIarray[2] );
         
         $ETA = $OGGI_AAAA - $NASCITA ;
         
         if ( $ETA < 0 ) return -1 ;
         else if ( $ETA == 0 ) return NO ;
         else
         {
            if ( $OGGI_MM < $NASCITA_MM ) $ETA-- ;
            else if ( $OGGI_MM == $NASCITA_MM )
            {
                if ( $OGGI_GG < $NASCITA_GG ) $ETA-- ;
            }
         }
    }

    return $ETA ;
}
?>