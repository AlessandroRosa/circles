<?php $PATH_TO_ROOT = "../../" ; ?>
<?php $PATH_TO_COMPLEX = $PATH_TO_ROOT ; ?>
<?php $PATH_TO_CIRCLES = $PATH_TO_COMPLEX ; ?>
<?php @include( $PATH_TO_COMPLEX."support/code/phpcode/fns/fns.php" ) ; ?>
<?php load_src_code_dir( $PATH_TO_COMPLEX."support/code/phpcode/objs/", "php", $ERRCODE ) ; ?>
<?php $lastreleasedate = get_params_ini( "DOCS", "lastreleasedate", $PATH_TO_CIRCLES."settings/circles.settings.ini" ) ; ?>
<?php $title = get_params_ini( "MAIN", "title", $PATH_TO_CIRCLES."settings/circles.settings.ini" ) ; ?>
<?php $subtitle = get_params_ini( "MAIN", "subtitle", $PATH_TO_CIRCLES."settings/circles.settings.ini" ) ; ?>
<?php $anchor = array_key_exists( 'a', $_GET ) ? trim( $_GET['a'] ) : "" ; ?>
<html>
<title><?php echo $title ; ?> - Documentation</title>
<head>
<link rel="shortcut icon" href="<?php echo $PATH_TO_CIRCLES ; ?>img/web/favicon.ico" />
<link href="../css/docs.style.css" rel="stylesheet" type="text/css">
<STYLE TYPE="text/css">
#contenttable
{
      font-size:8pt;
      background-color:white;
}

#contenttable_label
{
      font-size:8pt;
      background-color:#F2F2F2;
      padding:3px;
      text-align:center;
}

#contentsdiv
{
      font-size:10pt;
}

img
{
      background-color:white;
      border:1px solid #E0E0E0;
      margin:6px;
	    border-radius: 8px; 
	    -moz-border-radius: 8px; 
	    -webkit-border-radius: 8px; 
}

img.special:hover
{
    cursor:pointer;
}

img.zoomed
{

}

#contentpix
{
      width:180px;
      height:180px;
}

#contentpix2
{
      height:180px;
}

#contentpix_label
{
      font-size:8pt;
      font-weight:bold;
      color:#434343;
      text-align:center;
}

ol
{
		padding-left: 16px;
		margin:3px;
}

ol li
{
		padding-left:0px;
		padding-top:3px;
		margin:-3px;
}
</STYLE>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="../docs/js/docs.anchors.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="support/code/js/basements/jquery/jquery.min.js"></SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript" SRC="support/code/js/basements/obj.position.js"></SCRIPT>
<?php load_src_code_dir( $PATH_TO_COMPLEX."code/js/basements/fns/", "js", $ERRCODE ) ; ?>
</head>
<body>
<DIV ID="docsdiv" STYLE="position:absolute;"></DIV>
<table id="master" cellpadding=0 cellspacing=0 valign="top" BORDER="0">
<tr><td COLSPAN="2" ID="header" STYLE="color:#F2F2F2;"><?php echo "$title" ; ?> - <?php echo "$subtitle" ; ?></td></tr>
<tr>
    <td ID="navigation" VALIGN="top">
		<DIV ID="navigationdiv">
    <table cellpadding=0 cellspacing=0 valign="top">
    <tr><td VALIGN="top">
            <table cellpadding=0 cellspacing=0 valign="top">
            <tr><td STYLE="font-size:8pt;">Last update: <?php echo $lastreleasedate ; ?></td></tr>
            <tr><td HEIGHT="15"></td></tr>
            <tr><td VALIGN="top">
                    <?php $BOLD = "font-weight:bold;" ; ?>
                    <ol>
                    <li STYLE="<?php if ( $anchor == "circles" || strlen( $anchor ) == 0 )  echo "$BOLD" ; ?>"><a href="?a=circles">Circles</a></li>
                    <li STYLE="<?php if ( $anchor == "basicterminology" )  echo "$BOLD" ; ?>"><a href="?a=basicterminology">Basic terminology</a></li>
                    <li STYLE="<?php if ( $anchor == "gettingstarted" )  echo "$BOLD" ; ?>"><a href="?a=gettingstarted">Getting started</a></li>
                    <li STYLE="<?php if ( $anchor == "interface" )  echo "$BOLD" ; ?>"><a href="?a=interface">Interface layouts</a></li>
                    <li STYLE="<?php if ( $anchor == "layering" ) echo "$BOLD" ; ?>"><a href="?a=layering">Layering</a></li>
                    <li STYLE="<?php if ( $anchor == "methods" ) echo "$BOLD" ; ?>"><a href="?a=methods">Methods</a></li>
                    <li STYLE="<?php if ( $anchor == "ex01" )  echo "$BOLD" ; ?>"><a href="?a=ex01">Example 1: Draw the disk generators manually</a></li>
                    <li STYLE="<?php if ( $anchor == "ex02" )  echo "$BOLD" ; ?>"><a href="?a=ex02">Example 2: Set up a group</a></li>
                    <li STYLE="<?php if ( $anchor == "ex03" )  echo "$BOLD" ; ?>"><a href="?a=ex03">Example 3: Schottky circles (method)</a>
										<ol>
                    <li STYLE="<?php if ( $anchor == "ex04" )  echo "$BOLD" ; ?>"><a href="?a=ex04">Example 4: a Schottky group</a></li>
                    <li STYLE="<?php if ( $anchor == "ex05" )  echo "$BOLD" ; ?>"><a href="?a=ex05">Example 5: a Fuchsian group</a></li>
										</ol>
										</li>
                    <li STYLE="<?php if ( $anchor == "ex06" )  echo "$BOLD" ; ?>"><a href="?a=ex06">Example 6: &lsquo;One way&rsquo; inversion (method)</a></li>
                    <li STYLE="<?php if ( $anchor == "ex07" )  echo "$BOLD" ; ?>"><a href="?a=ex07">Example 7: Limit sets (method)</a></li>
                    <li STYLE="<?php if ( $anchor == "ex08" )  echo "$BOLD" ; ?>"><a href="?a=ex08">Example 8: Plug-ins</a></li>
                    <li STYLE="<?php if ( $anchor == "toolsgeometric" )  echo "$BOLD" ; ?>"><a href="?a=toolsgeometric">Tools for some basic geometric analysis</a></li>
                    <li STYLE="<?php if ( $anchor == "generals" )  echo "$BOLD" ; ?>"><a href="?a=generals">General Options</a></li>
                    <li STYLE="<?php if ( $anchor == "terminal" ) echo "$BOLD" ; ?>"><a href="?a=terminal">Terminal console</a></li>
                    <li STYLE="<?php if ( $anchor == "scripts" ) echo "$BOLD" ; ?>">
												<a href="?a=scripts">Scripts</a>
												<ol>
                        <li STYLE="<?php if ( $anchor == "commandslist" ) echo "$BOLD" ; ?>"><a href="?a=commandslist">Commands list</a></li>
		                    <li STYLE="<?php if ( $anchor == "listings" ) echo "$BOLD" ; ?>"><a href="?a=listings">Listings</a></li>
		                    <li STYLE="<?php if ( $anchor == "ex09" )  echo "$BOLD" ; ?>"><a href="?a=ex09">Example 9: my first script</a></li>
												</ol>
										</li>
                    
                    <li STYLE="<?php if ( $anchor == "keyboardshortcuts" ) echo "$BOLD" ; ?>"><a href="?a=keyboardshortcuts">Keyboard shortcuts</a></li>
                    <li STYLE="<?php if ( $anchor == "pixformats" ) echo "$BOLD" ; ?>"><a href="?a=pixformats">Pictures format</a></li>
                    <li STYLE="<?php if ( $anchor == "externallinks" ) echo "$BOLD" ; ?>"><a href="?a=externallinks">External links &amp; refs</a></li>
                    </ol>
                </td>
            </tr>
            </table>
        </td>
    </tr>
    </table>    
    </DIV>
    </td>
    <td ID="contents" VALIGN="top">
    <DIV ID="contentsdiv">
    <?php   switch( $anchor )
            {
                  case "":
                  case "circles": @include( "text/intro.php" ); break ;
                  case "basicterminology": @include( "text/basic.terminology.php" ); break ;
                  case "gettingstarted": @include( "text/getting.started.php" ); break ;
                  case "interface": @include( "text/interface.php" ); break ;
                  case "ex01": @include( "text/ex01.php" ); break ;
                  case "ex02": @include( "text/ex02.php" ); break ;
                  case "ex03": @include( "text/ex03.php" ); break ;
                  case "ex04": @include( "text/ex04.php" ); break ;
                  case "ex05": @include( "text/ex05.php" ); break ;
                  case "ex06": @include( "text/ex06.php" ); break ;
                  case "ex07": @include( "text/ex07.php" ); break ;
                  case "ex08": @include( "text/ex08.php" ); break ;
                  case "layering": @include( "text/layering.php" ); break ;
                  case "toolsgeometric": @include( "text/tools.geometric.php" ); break ;
                  case "generals": @include( "text/generals.php" ); break ;
                  case "terminal": @include( "text/terminal.console.php" ); break ;
                  case "commandslist": @include( "text/commands.list.php" ); break ;
                  case "keyboardshortcuts": @include( "text/keyboard.shortcuts.php" );
                  break ; case "pixformats": @include( "text/pixformats.php" ); break ;
                  case "listings": @include( "text/listings.php" ); break ;
                  case "externallinks": @include( "text/external.links.php" ); break ;
                  default: @include( "text/intro.php" ); break ;
            }
    ?>
    </DIV>
    </td>
</tr>
</table>
</body>
</html>