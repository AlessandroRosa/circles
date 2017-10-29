<?php $PATH_TO_ROOT = "../../../" ; ?>
<?php $PATH_TO_APP = "../../" ; ?>
<?php $PATH_TO_IMG = $PATH_TO_APP."support/img/" ; ?>
<?php $NOBAR = array_key_exists( "nb", $_GET ) ? intval( $_GET['nb'] ) : 0 ; ?>
<?php $folder = array_key_exists( 'folder', $_GET ) ? $_GET['folder'] : "" ; ?>
<?php $displayW = array_key_exists( "w", $_GET ) ? intval( $_GET['w'] ) : 0 ;
      $displayH = array_key_exists( "h", $_GET ) ? intval( $_GET['h'] ) : 0 ;
      if ( is_nan( $displayW ) ) $displayW = 0 ;
      if ( is_nan( $displayH ) ) $displayH = 0 ;
?>
<?php $lockat = array_key_exists( "lockat", $_GET ) ? intval( $_GET['lockat'] ) : 2 ; if ( is_nan( $lockat ) ) $lockat = 2 ; ?>
<?php @include( $PATH_TO_APP."support/code/phpcode/fns/fns.php" ) ; ?>
<?php load_src_code_dir( $PATH_TO_APP."support/code/phpcode/objs/", "php", $ERRCODE ) ; ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<?php @include( $PATH_TO_APP."meta/meta.tags.php" ); ?>
<?php load_src_code_dir( $PATH_TO_APP."support/code/js/basements/fns/", "js", $ERRCODE ) ; ?>
<?php load_src_code_dir( $PATH_TO_APP."support/code/js/basements/globals/", "js", $ERRCODE ) ; ?>
<?php load_src_code_dir( $PATH_TO_APP."support/code/js/basements/jquery/", "js", $ERRCODE ) ; ?>
<link rel="shortcut icon" href="<?php echo $PATH_TO_APP ; ?>img/web/favicon.ico" />
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
GLOBALapp = "Circles" ;
var _display_w = <?php echo $displayW ; ?>;
var _display_h = <?php echo $displayH ; ?>;
if ( _display_w == 0 || _display_h == 0 )
{
     var dimsARRAY = getViewportExtents(), _display_w = dimsARRAY[0], _display_h = dimsARRAY[1] ;
     var _GET_w = $_GET( "w" ), _GET_h = $_GET( "h" ), _GET_folder = $_GET( "folder" ) ;
     window.location.href = "?folder=" + _GET_folder + "&w=" + _display_w + "&h=" + _display_h ;
}
</SCRIPT>
<STYLE TYPE="text/css">
body
{
    font-family:lucida grande,tahoma,verdana,arial,sans-serif;
    font-size:8pt;
    margin:0px;
    padding:0px;
}

td
{
    padding:1px;
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

.general_rounded_corners
{
    border-radius: 8px; 
    -moz-border-radius: 8px; 
    -webkit-border-radius: 8px;
    padding:2px;
}

.general_rounded_corners_left
{
    -webkit-border-top-left-radius: 7px;
    -webkit-border-bottom-left-radius: 7px;
    -moz-border-radius-topleft: 7px;
    -moz-border-radius-bottomleft: 7px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    padding:2px;
}

.general_rounded_corners_right
{
    -webkit-border-top-right-radius: 7px;
    -webkit-border-bottom-right-radius: 7px;
    -moz-border-radius-topright: 7px;
    -moz-border-radius-bottomright: 7px;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    padding:2px;
}

.general_rounded_corners_top
{
    -webkit-border-top-left-radius: 7px;
    -webkit-border-top-right-radius: 7px;
    -moz-border-radius-topleft: 7px;
    -moz-border-radius-topright: 7px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    padding:2px;
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
</head>
<body>
<?php $N = 3 ; ?>
<DIV STYLE="position:absolute;width;400px;height:150px;top:150px;padding:4px;z-index:2;opacity:0.8;" ID="LOADINGdiv">
<table WIDTH="390" CLASS="general_rounded_corners" STYLE="background-color:#9BD2F2;">
<tr><td HEIGHT="20"></td></tr>
<tr><td ALIGN="center" STYLE="font-size:14pt;color:white;">Loading the catalogue of listings</td></tr>
<tr><td HEIGHT="20"></td></tr>
</table>
</DIV>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
$( "#LOADINGdiv" ).css( "left", ( _display_w - $( "#LOADINGdiv" ).width() ) / 2 ) ;
</SCRIPT>
<table cellpadding=0 cellspacing=0 valign="top" ID="MASTERTABLE" STYLE="display:none;">
<tr>
<td WIDTH="1"></td>
<td VALIGN="top" COLSPAN="3">
    <table cellpadding=0 cellspacing=0 valign="top">
    <tr>
        <td>
            <table cellpadding=0 cellspacing=0 valign="top">
                <tr><td STYLE="font-size:16pt;" COLSPAN="3">Circles - Listings catalogue</td></tr>
                <tr><td HEIGHT="4"></td></tr>
                <tr><td STYLE="font-size:8pt;color:blue;">
                    Coded by Alessandro Rosa - 
                  <SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
                  var m = new Array( "alessandro", ".a.", "rosa", "@", "gm", "ai", "l.", "c", "o", "m" );
                  document.write( "<a href=\"mailto:" );
                  document.write( m.join( "" ) );
                  document.write( "\">E-mail me</a>" );
                  </SCRIPT>
                </td>
                <td WIDTH="12"></td>
                <td VALIGN="bottom"><a TARGET="_blank" STYLE="color:#323232;" href="<?php echo $PATH_TO_APP ; ?>">Open here the &lsquo;&nbsp;Circles&nbsp;&rsquo; application</a></td>
                </tr>
            </table>
        </td>
    </tr>
    <tr><td HEIGHT="4"></td></tr>
    <tr>
        <td VALIGN="top">
        <table cellpadding=0 cellspacing=0 valign="top">
        <tr><td CLASS="general_rounded_corners_top" STYLE="font-size:10pt;background-color:#F6F6F6;padding:5px;">Pictures for limit sets look like scattered because I used a low depth value (usually, 8). Increase it at your choice, but beware: limit sets computations are very time-consuming, expecially on this platform, where
        javascript libraries are slower than those native ones for stand-alone applications.</td></tr>
        <tr><td CLASS="general_rounded_corners_bottom" STYLE="font-size:10pt;background-color:#FBFBFB;padding:5px;">Take care that, when applying the generators scheme, a good choice of the commutator may improve the quality of rendering, as well as speeding it up.</td></tr>
        </table>
        </td>
    </tr>
    <tr><td HEIGHT="4"></td></tr>
    <tr>
        <td valign="top">
        <table cellpadding=0 cellspacing=0 valign="top" WIDTH="100%">
        <tr>
            <td WIDTH="2"></td>
            <td WIDTH="240" VALIGN="top" CLASS="general_rounded_corners" STYLE="background-color:#F2F2FF;padding:2px;">
            <DIV ID="FOLDERStree" STYLE="position:relative;overflow:auto;">
            <?php @include( "folder.map.php" ); ?>
            <?php $FOLDERroot = "." ; $FOLDERmapRECURSION = 1 ;
                  echo folder_map( $FOLDERroot, 1, $FOLDERmapRECURSION, $ITEMS_COUNT ) ; ?>
            </DIV>
            </td>
            <td WIDTH="5"></td>
            <td VALIGN="top" CLASS="general_rounded_corners" STYLE="background-color:#EDEDFA;padding:4px;"><?php @include( "list.files.php" ); ?></td>
            <td WIDTH="2"></td>
        </tr>
        </table>
        </td>
    </tr>
    </table>
</td>
</tr>
</table>
</body>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var pageDIMS = getViewportExtents() ;
var pageHEIGHT = parseInt( pageDIMS[1], 10 ) ;
var DIVheight = pageHEIGHT - 240 ; // subtract caption height
$('#DIVlistingsLIST').css( 'height', DIVheight );
$('#FOLDERStree').css( 'height', DIVheight + 100 );
if ( $( "#TREEleafSELECTED" ).get(0) != null ) $('#FOLDERStree').scrollTop( $("#TREEleafSELECTED").offset().top - 160 );
$('#LOADINGdiv').hide();
$('#MASTERTABLE').show();
</SCRIPT>
</html>