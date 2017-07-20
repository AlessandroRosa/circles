<?php $PATH_TO_ROOT = "../../../../" ; ?>
<?php require_once( "../fns/fns.php" ) ;
      $folder = $_POST['folder'] ;
      $tip = $_POST['tip'] ;
      $exact = intval( $_POST['exact'] ) ; if ( is_nan( $exact ) ) $exact = 0 ;
      $filter = $_POST['filter'] ;
      $search_params = strpos( $_POST['search_params'], ",", 0 ) !== false ? explode( ",", $_POST['search_params'] ) : array() ;
      $inc_file_data = count( $search_params ) > 0 ? intval( $search_params[0] ) : 0 ;  if ( is_nan( $inc_file_data ) ) $inc_file_data = 0 ;
			$recursive = count( $search_params ) > 0 ? intval( $search_params[1] ) : 0 ;			if ( is_nan( $recursive ) ) $recursive = 1 ;
			$showfiles = count( $search_params ) > 0 ? intval( $search_params[2] ) : 0 ;			if ( is_nan( $showfiles ) ) $showfiles = 1 ;
			$showfolders = count( $search_params ) > 0 ? intval( $search_params[3] ) : 0 ;		if ( is_nan( $showfolders ) ) $showfolders = 1 ;

      $pattern = $exact ? "\b$tip\b" : "$tip" ;
      $fullpath = $PATH_TO_ROOT.$folder ;
      if ( file_exists( $fullpath ) )
      {
          $filelist = scan_folder( $fullpath, "$filter", $inc_file_data, $recursive, $showfiles, $showfolders ) ;
          $out_array = array();
          foreach( $filelist AS $chunk ) $out_array[] = $chunk['contents'] ;
          die( implode( "@@@", $out_array ) ) ;
      }
      else die( "" );
?>