<?php $PATH_TO_ROOT = "../../" ; ?>
<?php $PATH_TO_CIRCLES = "" ; ?>
<?php $PATH_TO_SUPPORT = "support/" ; ?>
<?php $PATH_TO_COMPONENTS = "code/js/components/" ; ?>
<?php $PATH_TO_FORMS = $PATH_TO_COMPONENTS."forms/" ; ?>
<?php $PATH_TO_IMG = $PATH_TO_SUPPORT."img/" ; ?>
<?php $PATH_TO_INI = $PATH_TO_CIRCLES."settings/circles.settings.ini" ; ?>
<?php @include( $PATH_TO_SUPPORT."code/phpcode/fns/fns.php" ); ?>
<?php load_src_code_dir( $PATH_TO_SUPPORT."code/phpcode/objs/", "php", $ERRCODE ); ?>
<?php $title = get_params_ini( "MAIN", "title", $PATH_TO_INI ); ?>
<?php $subtitle = get_params_ini( "MAIN", "subtitle", $PATH_TO_INI ); ?>
<?php $lastreleasedate = get_params_ini( "MAIN", "lastreleasedate", $PATH_TO_INI ); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<?php @include( $PATH_TO_CIRCLES."meta/meta.tags.php" ); ?>
<?php @include( $PATH_TO_CIRCLES."code/phpcode/app.init/app.init.php" ); ?>
<link rel="shortcut icon" href="<?php echo $PATH_TO_SUPPORT ; ?>img/web/favicon.ico" type="image/x-icon">
<link rel="icon" href="<?php echo $PATH_TO_SUPPORT ; ?>img/web/favicon.ico" type="image/x-icon">
<?php load_src_code_dir( $PATH_TO_CIRCLES."css/", "css", $ERRCODE, true ); ?>
<TITLE><?php echo "$title - $subtitle" ; ?></TITLE>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var _glob_path_to_circles = "<?php echo $PATH_TO_CIRCLES ; ?>" ;
var _glob_path_to_support = "<?php echo $PATH_TO_SUPPORT ; ?>" ;
var _glob_path_to_img = "<?php echo $PATH_TO_IMG ; ?>" ;
var _tmp_array = [];
</SCRIPT>
<?php load_src_code_dir( $PATH_TO_SUPPORT."code/js/basements/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/ctrls/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/pdf/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/levenshtein/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/math.js/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/random.gens/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/html2canvas/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/e.ps/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/latex.pic/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/js.zip/", "js", $ERRCODE );
      load_src_code_dir( $PATH_TO_SUPPORT."code/js/shared/splitter/", "js", $ERRCODE );
?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/components/globals/defaults/", "js", $ERRCODE, 1 ); ?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/components/globals/defs/", "js", $ERRCODE, 1 ); ?>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
_glob_app = "Circles" ;
_glob_path_to_root = "<?php echo $PATH_TO_ROOT ; ?>" ;
</SCRIPT>
</head>
<body ONLOAD="javascript:$('#alertYESbtn').focus();" STYLE="overflow:hidden;">
<?php $LOADINGdivTITLE = $title ;
      $LOADINGdivSUBTITLE = $subtitle ;
      $LOADINGdivRELEASEDATE = $lastreleasedate ;
      $LOADINGdivMESSAGE = "Loading the framework ..." ;
      $WAITimgPATH = "support/img/wait/wait.animated.gif" ;
      @include( $PATH_TO_SUPPORT."code/phpcode/divs/loading.php" ); ?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/phpcode/panels/", "php", $ERRCODE ); ?>
<DIV ID="MASTERdiv" STYLE="position:absolute;left:0px;top:0px;display:none;width:100%;" ALIGN="left">
<table cellpadding=0 cellspacing=0 valign="top" BORDER="0" WIDTH="100%">
<tr><td HEIGHT="2"></td></tr>
<tr><td VALIGN="top" ALIGN="center" ID="menucontainer" STYLE="height:42px;"><?php @include( $PATH_TO_CIRCLES."screen/menu.php" ); ?></td></tr>
<tr><td HEIGHT="3"></td></tr>
<tr><td VALIGN="top"><DIV ID="interfacecontainer" STYLE="position:relative;"></DIV></td></tr>
<tr><td HEIGHT="18"></td></tr>
</table>
</DIV>
<DIV ID="CIRCLESbarsSTATUSBARdiv" CLASS="status_bar_container" STYLE="display:none;width:auto;height:auto;"></DIV>
<canvas ID="CIRCLESbipCANVAS" STYLE="display:none;background-color:green;width:400px;height:400px;" WIDTH="400" HEIGHT="400"></canvas>
<DIV STYLE="position:absolute;display:none;"><INPUT type='file' id='customloader' name='customloader[]' MULTIPLE="multiple" VALUE=""></DIV>
</body>
</html>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/components/globals/vars/", "js", $ERRCODE, 1 ); ?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/components/globals/init/", "js", $ERRCODE, 1 ); ?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/components/", "js", $ERRCODE, 1,
                         array( $PATH_TO_CIRCLES."code/js/components/forms/",
                                $PATH_TO_CIRCLES."code/js/components/globals/",
                                $PATH_TO_CIRCLES."code/js/components/libs/on.demand/",
                                $PATH_TO_CIRCLES."code/js/components/terminal/commands/",
                                $PATH_TO_CIRCLES."code/js/components/samples/"
                              )
                       ); ?>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var LANG = $_GET( "lang" );      if ( LANG == null || LANG == "undefined" || LANG.length == 0 ) LANG = "en" ;
var _filename = _glob_path_to_circles + "code/js/components/langs/" + LANG + "/circles.lang.js" ;
loadScript(_filename, function(){ /*initialization code*/ });

_glob_multithreading_compatible = is_multithreading_compatible() ? 1 : 0 ;
_glob_multithreading = _glob_multithreading_compatible ;  // default to multi-threading
_glob_canvas_width = circles_lib_interface_default();
var _viewport_array = getViewportExtents();
var _viewport_width = _viewport_array[0], _viewport_height = _viewport_array[1] ;
var _aspect_ratio = _viewport_width / _viewport_height ;
CIRCLES_VIEWPORT_ASPECT_RATIO = CIRCLES_VIEWPORT_ASPECT_RATIOS_SET[ _aspect_ratio.get_closer_value_from( [ 5/4, 4/3, 16/10, 16/9 ] )[0] ] ;
</SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
_glob_src_canvas_mode = ENABLED ;
_glob_appTITLE = "<?php echo $title ; ?>" ;
_glob_appSUBTITLE = "<?php echo $subtitle ; ?>" ;
_glob_appLASTreleaseDATE = "<?php echo $lastreleasedate ; ?>" ;
_plugin_openref_array = _tmp_array.clone_associative();
_tmp_array.flush();
</SCRIPT>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
alert_set_imgfolder_path( _glob_path_to_img );
<?php @include( $PATH_TO_CIRCLES."screen/forms.list.php" ); ?>
CIRCLESobjectsINIT(0);
circles_lib_plugin_remotectrl_send( YES, 'tools', "general.options", 1, 2, 3, 4, 5, 6 );
circles_lib_statusbar_load( "vert", "left", "top", NO, 10, 100 );
</SCRIPT>
<?php if ( array_key_exists( "demo", $_GET ) )
{
    $DEMO_IDX = intval( $_GET['demo'] ) ; if ( is_nan( $DEMO_IDX ) ) $DEMO_IDX = 0 ;
    switch( $_GET['demo'] )
    {
      case 1: @include( "demos/$DEMO_IDX.demo.basic.maskit.param.php" ); break ;
      case 2: @include( "demos/$DEMO_IDX.demo.random.jorgensen.php" ); break ;
      case 3: @include( "demos/$DEMO_IDX.demo.console.php" ); break ;
      case 4: @include( "demos/$DEMO_IDX.demo.console.conjugation.php" ); break ;
      case 5: @include( "demos/$DEMO_IDX.demo.fuchsian.group.php" ); break ;
      case 6: @include( "demos/$DEMO_IDX.demo.modular.group.php" ); break ;
      case 7: @include( "demos/$DEMO_IDX.demo.sasaki.group.php" ); break ;
      case 8: @include( "demos/$DEMO_IDX.demo.discreteness.locus.php" ); break ;
      default: break ;
    }
}
?>
<?php load_src_code_dir( $PATH_TO_CIRCLES."code/js/init/", "js", $ERRCODE ); ?>
<?php @include( $PATH_TO_CIRCLES."triggers/triggers.init.php" ); ?>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
circles_lib_files_load_default_fn_lib();
</SCRIPT>