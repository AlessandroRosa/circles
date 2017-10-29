<?php $PATH_TO_ROOT = "../../../" ; ?>
<?php $PATH_TO_APP = "../../" ; ?>
<?php $FILE = $_GET['f']; ?>
<?php $DIRNAME = pathinfo( $FILE, PATHINFO_DIRNAME );
      $BASENAME = pathinfo( $FILE, PATHINFO_BASENAME );
      $FILENAME = pathinfo( $FILE, PATHINFO_FILENAME );
      
      $CODEFILE = "$FILENAME.txt" ;
      $PIXFILE = "$FILENAME.png" ;

      $gens_files = glob( "$DIRNAME/$FILENAME.gens*.png" );
      $gens_filescount = count( $gens_files ) ;
      $gens_exist = $gens_filescount == 0 ? 0 : 1 ;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<title><?php echo $BASENAME ; ?></title>
<?php @include( $PATH_TO_ROOT."meta/meta.tags.php" ); ?>
<?php @include( $PATH_TO_APP."support/code/phpcode/fns/fns.php" ) ; ?>
<?php load_src_code_dir( $PATH_TO_APP."support/code/js/basements/", "js", $ERRCODE ) ; ?>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
// A simple function to copy a string to clipboard. See https://github.com/lgarron/clipboard.js for a full solution.
var copyToClipboard = (function() {
  var _dataString = null;
  document.addEventListener("copy", function(e){
    if (_dataString !== null) {
      try {
        e.clipboardData.setData("text/plain", _dataString);
        e.preventDefault();
      } finally {
        _dataString = null;
      }
    }
  });
  return function(data) {
    _dataString = data;
    document.execCommand("copy");
    alert( "This listing has been successfully copied into the Clipboard !" );
  };
})();
</SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var UNDEF = -1 ;
var _display_w = $( window ).width();
var _display_h = $( window ).height();
</SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var GLOBALapp = "Circles", GLOBALpathTOroot = "<?php echo $PATH_TO_ROOT ; ?>" ;
function SAVEtoFILE()
{
    var _container = $( "#CODEcontainer" ).get(0);
    if ( _container == null ) alert( "Memory failure: can't save this code into a text file." );
    else
    {
         var _out_file_txt = _container.innerHTML ;
             _out_file_txt = _out_file_txt.strip_tags();
         var blob = new Blob( new Array( _out_file_txt ), { type: 'plain/text', endings: 'native' });
         saveAs( blob, "<?php echo $CODEFILE ; ?>" );
    }
}
</SCRIPT>
<link rel="shortcut icon" href="<?php echo $PATH_TO_APP ; ?>img/web/favicon.ico" />
<link href="<?php echo $PATH_TO_ROOT ; ?>docs/css/docs.style.css" rel="stylesheet" type="text/css">
<STYLE TYPE="text/css">
body
{
    font-family:lucida grande,tahoma,verdana,arial,sans-serif;
    font-size:8pt;
    margin:0px;
    padding:0px;
    overflow:none;
}

table
{
		border-collapse:collapse;
		padding:0px;
    margin:0px;
}

a
{
    text-decoration:none;
    color:black;
}

a:hover
{
    text-decoration:none;
    color:blue;
}

.link
{
    font-family:lucida grande,tahoma,verdana,arial,sans-serif;
    font-size:8pt;
    color:#232323;
}

.link:hover
{
    color:#57839F;
    cursor:pointer;
}

.roundedcorners
{
    border-radius: 5px; 
    -moz-border-radius: 5px; 
    -webkit-border-radius: 5px; 
}

.roundedcorners_shadow
{
    border-radius: 5px; 
    -moz-border-radius: 5px; 
    -webkit-border-radius: 5px; 

    -webkit-box-shadow: 0px 0px 5px 0px #808080;
    -moz-box-shadow: 0px 0px 5px 0px #808080;
    box-shadow: 0px 0px 5px 0px #808080;
}

.general_rounded_corners_bottom
{
    -webkit-border-bottom-right-radius: 7px;
    -webkit-border-bottom-left-radius: 7px;
    -moz-border-radius-bottomright: 7px;
    -moz-border-radius-bottomleft: 7px;
    border-bottom-right-radius: 7px;
    border-bottom-left-radius: 7px;
    padding:2px;
}
</STYLE>
<body>
<DIV STYLE="position:absolute;width;400px;height:150px;top:150px;padding:4px;z-index:2;opacity:0.8;" ID="LOADINGdiv">
<table WIDTH="390" CLASS="general_rounded_corners" STYLE="background-color:#9BD2F2;">
<tr><td HEIGHT="20"></td></tr>
<tr><td ALIGN="center" STYLE="font-size:14pt;color:white;">Loading the catalogue of settings</td></tr>
<tr><td HEIGHT="20"></td></tr>
</table>
</DIV>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
$( "#LOADINGdiv" ).css( "left", ( _display_w - $( "#LOADINGdiv" ).width() ) / 2 ) ;
</SCRIPT>
<DIV STYLE="width:100%;display:block;" ALIGN="center">

<table WIDTH="99%" ALIGN="center" cellpadding=0 cellspacing=0 valign="top" ID="MASTERTABLE" STYLE="display:none;">
<tr>
    <td VALIGN="top" COLSPAN="7" WIDTH="100%">
    <table valign="top" WIDTH="100%">
    <tr><td STYLE="font-size:16pt;" COLSPAN="9" ID="header">Circles - Listings catalogue</td></tr>
    <tr><td HEIGHT="4"></td></tr>
    <tr><td WIDTH="12"></td>
        <td STYLE="font-size:10pt;color:blue;">
        Coded by Alessandro Rosa - 
        <SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
                  var m = new Array( "zandor", "_", "zz", "@", "yahoo", ".", "it" );
                  document.write( "<a href=\"mailto:" );
                  document.write( m.join( "" ) );
                  document.write( "\">E-mail me</a>" );
        </SCRIPT>
        </td>
        <td WIDTH="12"></td>
        <td VALIGN="bottom"><a TARGET="_blank" STYLE="font-size:10pt;color:#323232;" href="<?php echo $PATH_TO_APP ; ?>">Open here the &lsquo;&nbsp;Circles&nbsp;&rsquo; application</a></td>
        <td WIDTH="24"></td>
        <td VALIGN="bottom"><a TARGET="_self" STYLE="font-size:10pt;color:#323232;" href="index.php">Back to main page of listings</a></td>
        <td WIDTH="24"></td>
        <td VALIGN="bottom"><a TARGET="_self" STYLE="font-size:10pt;color:#323232;" href="<?php echo $PATH_TO_ROOT ; ?>docs/circles/circles.docs.php">Docs</a></td>
        <td WIDTH="12"></td>
    </tr>
    </table>
    </td>
</tr>
<tr><td HEIGHT="12"></td></tr>
<tr>
    <td WIDTH="7"></td>
    <td VALIGN="top" WIDTH="240" STYLE="padding:5px;background-color:#F6F6F6;" CLASS="roundedcorners_shadow">
    <DIV STYLE="position:relative;width:100%;height:0px;overflow:auto;" ID="DIVexamplesLIST">
    <table valign="top" WIDTH="100%" BORDER="0">
    <tr><td HEIGHT="8"></td></tr>
    <tr><td COLSPAN="3" STYLE="font-size:10pt;">Inside this folder<br><b STYLE="font-size:14pt;color:#434343;"><?php echo str_replace( ".", " ", ucfirst( basename( "$DIRNAME" ) ) ) ; ?></b></td></tr>
    <tr><td HEIGHT="12"></td></tr>
    <?php $FILESlist = scan_folder( $DIRNAME, "/.txt/" ) ;
          $f = count( $FILESlist ) ;      $f-- ; // remove the current element from list counting
          if ( $f > 0 )
          {
    ?>
               <?php $SELECTED = 0 ;
                     $CNT = 0 ;
                     foreach( $FILESlist AS $K => $CHUNK )
                     {
                          $FILE = $CHUNK['filename'] ;
                          $CODEFILE_FULLPATH = "$DIRNAME/$FILE" ;
                          
                          $TIME = $CHUNK['time'] ;
                          $bFOUND = ( strcmp( $FILE, $BASENAME ) == 0 ) ? 1 : 0 ;
                          $bIN = ( $bFOUND ) ? "<b>" : "" ;
                          $bOUT = ( $bFOUND ) ? "</b>" : "" ;
                          $EXTENSION = pathinfo( $CHUNK['fullpath'], PATHINFO_EXTENSION );
                          $EXTENSION = strtolower( $EXTENSION );

                          if ( $bFOUND ) $SELECTED = $CNT ;
                          
                          if ( strcmp( $EXTENSION, "txt" ) == 0 )
                          {
                              $CANDIDATEthumbFILE = str_replace( ".txt", ".thumb.png", $CHUNK['fullpath'] ) ;
                              $CANDIDATEpixFILE = str_replace( ".txt", ".png", $CHUNK['fullpath'] ) ;
                          ?>
                          <tr>
                              <td VALIGN="top" <?php echo $bFOUND ? "ID=\"MENUENTRYselected\"" : "" ; ?> STYLE="color:#232323;"><a HREF="?f=<?php echo "$CODEFILE_FULLPATH" ; ?>"><?php echo "$bIN$FILE$bOUT" ; ?></A></td>
                              <?php
                                    if ( file_exists( "$CANDIDATEthumbFILE" ) )
                                    {
                                    ?>
                                    <td ROWSPAN="3" VALIGN="top" ALIGN="center" CLASS="general_rounded_corners" STYLE="padding:2px;background-color:white;">
                                    <a HREF="?f=<?php echo "$CODEFILE_FULLPATH" ; ?>">
                                    <IMG BORDER="0" WIDTH="40" SRC="<?php echo "$CANDIDATEthumbFILE" ; ?>">
                                    </a>
                                    </td>
                                    <td ROWSPAN="3" WIDTH="5"></td>
                                    <?php
                                    }
                              ?>
                          </tr>
                          <tr><td HEIGHT="2"></td></tr>
                          <tr><td STYLE="color:#909090;"><?php echo $TIME ; ?></td></tr>
                          <tr><td HEIGHT="10"></td></tr>
                          <?php
                          }
                          
                          $CNT++ ;
                     }
               ?>
               <?php
          }
          else
          {
               ?>
               <tr><td STYLE="color:#909090;font-size:12pt;">Sorry, no more entries</td></tr>
               <tr><td HEIGHT="4"></td></tr>
               <?php
          }
    ?>
    </table>
    </DIV>
    </td>
    <td WIDTH="7"></td>
    <td VALIGN="top">
    <table valign="top" WIDTH="100%">
    <tr>
    <td VALIGN="top">
        <div STYLE="position:relative;height:500px;overflow:auto;font-size:10pt;padding:4px;background-color:#353535;word-wrap:break-word;"
             ID="CODEcontainer" CLASS="roundedcorners_shadow"><pre STYLE="font-size:8pt;color:lime;"><DIV ID="srcode_div"><?php echo ( file_exists( "$DIRNAME/$CODEFILE" ) ) ? file_get_contents( "$DIRNAME/$CODEFILE" ) : "File code not found" ; ?></DIV></pre></div>
    </td>
    </tr>
    <tr><td HEIGHT="5"></td></tr>
    <tr>
        <td VALIGN="top" ALIGN="right">
        <table valign="top">
        <tr>
            <td CLASS="link" ALIGN="right" ONCLICK="javascript:SAVEtoFILE();">Save this code into a file</td>
            <td WIDTH="25"></td>
            <td CLASS="link" ONMOUSEOVER="javascript:this.style.cursor='pointer';" ALIGN="right" ONCLICK="javascript:copyToClipboard($('#srcode_div').html());">Copy this code into clipboard</td>
            <td WIDTH="25"></td>
        </tr>
        </table>
        </td>
    </tr>
    </table>
    </td>
    <td WIDTH="7"></td>
    <?php $PIXcolumnWIDTH = 330 ; ?>
    <td VALIGN="top" WIDTH="<?php echo $PIXcolumnWIDTH ; ?>" ALIGN="center">
		<table valign="top" WIDTH="<?php echo $PIXcolumnWIDTH ; ?>">
		<tr><td ID="pixcontainer" CLASS="link"><IMG ONCLICK="javascript:window.open(this.src,'','');" CLASS="roundedcorners_shadow" ID="pix" WIDTH="320" ONERROR="javascript:this.src='<?php echo $PATH_TO_ROOT ; ?>img/icons/error/error.02.300x300.png';" STYLE="border:1px dotted #D7D7D7;" SRC="<?php echo "$DIRNAME/$PIXFILE" ; ?>"></td></tr>
		<?php if ( $gens_exist ) { ?>
		<tr><td HEIGHT="5"></td></tr>
		<tr><td STYLE="font-size:7pt;color:#323232;" ALIGN="center">isometric circles of the generators are shown in the top left thumbnail</td></tr>
		<?php } ?>
    <?php $BLOWUPpattern = "$FILENAME.zoom([\.0-9]{0,}).png" ;
          $BLOWUPSlist = scan_folder( $DIRNAME, "/^$BLOWUPpattern$/" ) ;
          $nBLOWUPS = count( $BLOWUPSlist ) ;
          $BLOWUPside = 55 ;
          $ROWS_UPPER_BOUND = 2 ;
          $COLUMNS = floor( $PIXcolumnWIDTH / $BLOWUPside ) ;
          $COLUMNS-- ;
          $COLUMNS = max( 1, $COLUMNS ) ;
          if ( $nBLOWUPS > 0 )
          {
              ?>
          		<tr><td HEIGHT="5"></td></tr>
          		<tr><td>More pix or blow-ups</td></tr>
          		<tr><td HEIGHT="5"></td></tr>
              <tr>
              <td VALIGN="top">
              <?php if ( $nBLOWUPS > ( $COLUMNS * $ROWS_UPPER_BOUND ) ) { ?><DIV STYLE="position:relative;width:100%;overflow:auto;padding:2px;height<?php echo $BLOWUPside * $ROWS_UPPER_BOUND ; ?>px;"><?php } ?>
              <table>
              <?php $COUNTER = 0 ;
                    foreach( $BLOWUPSlist AS $K => $CHUNK )
                    {
                        if ( $COUNTER % $COLUMNS == 0 ) echo "<tr>" ;
                        $IMGPATH = $DIRNAME."/".$CHUNK['file'] ;
                        ?>
                        <td VALIGN="top" CLASS="link"><IMG ONCLICK="javascript:window.open(this.src,'','');" CLASS="roundedcorners_shadow" SRC="<?php echo $IMGPATH ; ?>" WIDTH="<?php echo $BLOWUPside ; ?>" HEIGHT="<?php echo $BLOWUPside ; ?>"></td>
                        <td WIDTH="3"></td>
                        <?php
                        if ( $COUNTER % $COLUMNS == ( $COLUMNS - 1 ) ) echo "</tr><tr><td HEIGHT=\"3\"></td></tr>" ;
                        $COUNTER++ ;
                    }
              ?>
              </table>
              <?php if ( $nBLOWUPS > ( $COLUMNS * $ROWS_UPPER_BOUND ) ) { ?></DIV><?php } ?>
              </td>
              <?php
          }
    ?>
		</table>
		</td>
    <td WIDTH="7"></td>
</tr>
</table>
</DIV>
<?php
if ( $gens_exist )
{
     $counter = 1 ;
     $pix_width = ( $gens_filescount == 1 ) ? 100 : floor( 100 / $gens_filescount ) ;
     foreach( $gens_files AS $K => $gens_pix )
     {
?>
      <DIV ID="gensDIV<?php echo $counter ; ?>" STYLE="position:absolute;z-index:3;width:80px;height:80px;display:none;">
      <IMG ONMOUSEOVER="javascript:this.style.cursor='pointer';"
      		 ONCLICK="javascript:window.open(this.src);"
      		 CLASS="roundedcorners_shadow" ID="pix" WIDTH="<?php echo $pix_width ; ?>" STYLE="border:1px dotted #D7D7D7;opacity:0.92;background-color:white;" SRC="<?php echo trim( "$gens_pix" ) ; ?>">
      </DIV>
<?php $counter++ ;
     }
}
?>
</body>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var pageDIMS = getViewportExtents() ;
var pageHEIGHT = safe_int( pageDIMS[1], 300 ) ;
var DIVheight = pageHEIGHT - 240 ; // subtract caption height
$('#LOADINGdiv').hide();
$('#MASTERTABLE').show();
</SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var pageDIMS = getViewportExtents() ;

var DIVexamplesLIST = $( "#DIVexamplesLIST" ).get(0);
if ( DIVexamplesLIST != null ) DIVexamplesLIST.style.height = ( parseInt( pageDIMS[1], 10 ) - 100 ) + "px" ; 

var _entry = $( "#MENUENTRYselected" ).get(0) ;
if ( _entry != null )
$('#DIVexamplesLIST').scrollTop( $("#MENUENTRYselected").offset().top - 90 );
$('#CODEcontainer').css( "width", pageDIMS[0] - ( 245 + 330 + 7 * 3 ) );
$('#CODEcontainer').css( "height", parseInt( DIVexamplesLIST.style.height, 10 ) - 30 );

var pixcontainer = $( "#pixcontainer" ).get(0);
var pixcontainer_w, pixcontainer_left, pixcontainer_top ;
var pix = $( "#pix" ).get(0);
    if ( pixcontainer != null && pix != null )
    {
       pixcontainer_w = $( "#pixcontainer" ).width() ;
       var _pos_chunk = $( "#pixcontainer" ).offset();
       pixcontainer_left = _pos_chunk['left'], pixcontainer_top = _pos_chunk['top'] ;
       pix.style.width = ( pixcontainer_w - 8 ) + "px" ;
    }

<?php if ( $gens_exist )
      for( $i = 1 ; $i <= $gens_filescount ; $i++ )
      {
?>
var gensDIV = $( "#gensDIV<?php echo $i ;?>" ).get(0);
if ( gensDIV != null )
{
     $( "#gensDIV<?php echo $i ;?>" ).css( "left", ( pixcontainer_left + <?php echo $pix_width * ( $i-1 ) + ( $i-1 == 0 ? 0 : 8 ) ; ?> + 8 ) + "px" ) ;
     $( "#gensDIV<?php echo $i ;?>" ).css( "top", ( pixcontainer_top + 8 ) + "px" ) ;
     $( "#gensDIV<?php echo $i ;?>" ).show();
}
<?php } ?>
</SCRIPT>
</html>