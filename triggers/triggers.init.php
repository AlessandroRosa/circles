<?php
      $dir = scan_folder( "triggers/", "/^.*\.(ini)$/i", 0, 1, 1, 0 );
      if ( count( $dir ) > 0 )
      {
          ?>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
<?php
foreach( $dir AS $K => $CHUNK )
{
    $id = get_params_ini( "TRIGGER", "id", $CHUNK['fullpath'] );
    $init_fn = get_params_ini( "TRIGGER", "init_fn", $CHUNK['fullpath'] );
    $title = addslashes( get_params_ini( "TRIGGER", "title", $CHUNK['fullpath'] ) );
    $desc = addslashes( get_params_ini( "TRIGGER", "description", $CHUNK['fullpath'] ) );
    $file = get_params_ini( "TRIGGER", "file", $CHUNK['fullpath'] );
    $automatic = get_params_ini( "TRIGGER", "auto", $CHUNK['fullpath'] );
    if ( is_nan( $automatic ) || ( $automatic != 0 && $automatic != 1 ) ) $automatic = 0 ;
		$PATH_TO_TRIGGER = pathinfo( $CHUNK['fullpath'], PATHINFO_DIRNAME );
    $FULLPATH = "$PATH_TO_TRIGGER/$file" ; ?>
_glob_triggers_table['<?php echo $id ; ?>'] = <?php echo "['$title','$desc','$init_fn','$FULLPATH','$automatic']" ; ?> ;
<?php     } ?>
</SCRIPT>
<?php } ?>