<?php $CONTENTS = scan_folder( "$folder", "/.txt/i" ) ;
      $N = count( $CONTENTS );
      $COLS = floor( ( $displayW - 250 ) / 244 ) ; // minus the folder list div width, divided by each experiment pix box width
      $INIPATH = $PATH_TO_APP."listings/circles/$folder/folder.ini" ;
      $LABEL = file_exists( $INIPATH ) ? get_params_ini( "FOLDER", "label", $INIPATH ) : "(Unknown ref)" ;
      $SUB_LABEL_1 = file_exists( $INIPATH ) ? get_params_ini( "FOLDER", "sub.label.1", $INIPATH ) : "" ;
      $NOTES = file_exists( $INIPATH ) ? get_params_ini( "FOLDER", "notes", $INIPATH ) : "(Unknown ref)" ;
      $NOTES = trim( $NOTES );
      if ( $N > 0 && $folder )
      {
      echo "$folder ".__LINE__."<br><br>" ;
          $current_folder_array = explode( "/", $folder );
          $n_folders = count( $current_folder_array );
          $current_folder = ( $n_folders > 0 ) ? $current_folder_array[$n_folders-1] : "" ;
      echo "$current_folder ".__LINE__."<br><br>" ;
          ?>
          <table cellpadding=0 cellspacing=0 valign="top" BORDER="0" WIDTH="100%">
          <tr>
          <td VALIGN="top" CLASS="general_rounded_corners" STYLE="background-color:white;">
          <table>
          <tr><td STYLE="font-size:14pt;"><?php echo "$LABEL" ; ?></td></tr>
          <tr><td HEIGHT="1"></td></tr>
          <tr><td><?php echo "$SUB_LABEL_1" ; ?></td></tr>
          <tr><td HEIGHT="1"></td></tr>
          <?php if ( strlen( $NOTES ) > 0 ) { ?>
          <tr><td VALIGN="top">Notes: <SPAN STYLE="color:blue;"><?php echo $NOTES ; ?></SPAN></td></tr>
          <tr><td HEIGHT="5"></td></tr>
          <?php } ?>
          </table>
          </td>
          </tr>
          <tr>
              <td VALIGN="top">
              <DIV STYLE="position:relative;width:auto;height:300px;overflow:auto;padding:2px;" ID="DIVlistingsLIST">
              <table cellpadding=0 cellspacing=0 valign="top" BORDER="0">
          <?php $CNT = 0 ;
                $PALETTE = array();
                $PALETTE[] = "#F0F0FC;" ;
                $PALETTE[] = "#F6F6FC;" ;
                $PALETTE[] = "#F6F6FC;" ;
                $PALETTE[] = "#F0F0FC;" ;
                $PALETTElen = count( $PALETTE );
                
                $CNT = 0 ;
                
                foreach( $CONTENTS AS $K => $CHUNK )
                {
                      $F = $CHUNK['fullpath'] ;
                      $FILE = $CHUNK['filename'] ;
                      $OUTFILE = ( strlen( $FILE ) > 24 ) ? substr( $FILE, 0, 20 )."&nbsp;..." : $FILE ;
                      $CANDIDATEthumbFILE = str_replace( ".txt", ".thumb.png", $F ) ;
                      $CANDIDATEpixFILE = str_replace( ".txt", ".png", $F ) ;
                      $FILE_FOLDER = 
                      $current_folder_array = explode( "/", $F );
                      
                      $n_folders = count( $current_folder_array );
                      if ( $n_folders > 0 )
                      {
                          unset( $current_folder_array[$n_folders-1] );
                          $current_folder = implode( "/", $current_folder_array );
                      }
                      else $current_folder = "" ;

                      $ISDIR = is_dir( "$current_folder/$FILE" ) ? 1 : 0 ;
                      $ISFILE = is_file( "$current_folder/$FILE" ) ? 1 : 0 ;
                      $EXTENSION = pathinfo( $F, PATHINFO_EXTENSION );
                      $EXTENSION = strtolower( $EXTENSION );
                      
                      $REDIRECT = $ISDIR ? "index.php?folder=$current_folder/$FILE" : "display.php?f=$current_folder/$FILE" ;
                      
                      if ( $ISDIR || strcmp( $EXTENSION, "txt" ) == 0 )
                      {
                            $FONTCOLOR = ( $ISDIR ) ? "orange" : "#323232" ;
                            $TYPE = ( $ISDIR ) ? "Folder" : "File" ;
                            $ANCHOR_TARGET = ( $ISDIR ) ? "" : "TARGET=\"_blank\"" ;
                ?>
                <?php if ( $CNT % $COLS == 0 ) { ?><tr><?php } ?>
                    <td WIDTH="2"></td>
                    <td VALIGN="top" WIDTH="240" CLASS="general_rounded_corners" STYLE="background-color:<?php echo $PALETTE[$CNT%$PALETTElen] ?>;">
                    <table cellpadding=0 cellspacing=0 valign="top">
                    <tr>
                        <td ROWSPAN="3" WIDTH="3"></td>
                        <td ROWSPAN="3" WIDTH="10" VALIGN="top"><?php echo ( $CNT + 1 ).")" ; ?></td>
                        <td ROWSPAN="3" WIDTH="3"></td>
                        <td VALIGN="top"><A <?php echo $ANCHOR_TARGET ; ?> STYLE="color:<?php echo $FONTCOLOR ; ?>;" HREF="<?php echo $REDIRECT ; ?>"><?php echo "$OUTFILE" ; ?></A></td>
                        <td ROWSPAN="3" WIDTH="12"></td>
                        <?php $CANDIDATEthumbFILE = file_exists( "$CANDIDATEthumbFILE" ) ? "$CANDIDATEthumbFILE" : ( file_exists( "$CANDIDATEpixFILE" ) ? "$CANDIDATEpixFILE" : $PATH_TO_ROOT."img/icons/error/error.02.300x300.png" ) ;
                              if ( $CANDIDATEthumbFILE && !$ISDIR ) { ?>
                        <td ROWSPAN="3" STYLE="background-color:white;padding:4px;" VALIGN="top" CLASS="general_rounded_corners"><A <?php echo $ANCHOR_TARGET ; ?> HREF="<?php echo $REDIRECT ; ?>"><IMG BORDER="0" WIDTH="70" SRC="<?php echo "$CANDIDATEthumbFILE" ; ?>"></A></td>
                        <?php }
                              else
                              {
                        ?>
                        <td ROWSPAN="3" STYLE="background-color:white;color:lightgray;padding:6px;text-align:center;" VALIGN="top" CLASS="general_rounded_corners">Pix is unavailable</td>                              
                        <?php } ?>
                        <td ROWSPAN="3" WIDTH="6"></td>
                    </tr>
                    <tr><td HEIGHT="4"></td></tr>
                    <tr><td><?php echo $CHUNK['time']; ?></td></tr>
                    </td>
                    </tr>
                    </table>
                <?php if ( $CNT % $COLS == ( $COLS - 1 ) ) { ?></tr><tr><td HEIGHT="4"></td></tr><?php } ?>
                <?php $CNT++ ;
                      }
                }
          ?>
          <?php if ( $CNT % $COLS != ( $COLS - 1 ) ) { ?></tr><tr><td HEIGHT="1"></td></tr><?php } ?>
                </table>
                </div>
                </td>
                </tr>
          </table>
          <?php
      }
      else if ( $N == 0 && $folder )
      {
           $SUB_CONTENTS = scan_folder( $PATH_TO_APP."listings/$folder", "", "/.txt/i", 1 ) ;
           $SUB_N = count( $SUB_CONTENTS );
           ?>
           <table cellpadding=0 cellspacing=0 valign="top" BORDER="0" WIDTH="100%">
           <tr><td STYLE="font-size:14pt;color:#B0B0B0;"><?php echo $LABEL ; ?></td></tr>
           <tr><td HEIGHT="5"></td></tr>
           <tr><td STYLE="font-size:12pt;color:#B0B0B0;">This folder does not includes listings.</td></tr>
           <?php
                 if ( $SUB_N > 0 )
                 {
                 ?>
                 <tr><td HEIGHT="48"></td></tr>
                 <tr><td STYLE="font-size:12pt;color:#B0B0B0;">Try digging into the sub-folders on the left.</td></tr>
                 <?php
                 }   
           ?>
           </table>
           <?php
      }
?>
