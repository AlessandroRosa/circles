<a name="batchprocessing" ID="title">Commands list (Terminal Console)</a><br><br>
<?php
      $BATCHarray = array();
      $BATCHarray["accuracy"] = array( "cmd" => "accuracy",
                             "desc" => "set approximation accuracy for results" ) ;
      $BATCHarray["all"] = array( "cmd" => "all",
                             "desc" => "a trigger for toggling on/off a set of options for drawing" ) ;
      $BATCHarray["alphabet"] = array( "cmd" => "alphabet",
                             "desc" => "retrieve current alphabet" ) ;
      $BATCHarray["auto"] = array( "cmd" => "auto",
                             "desc" => "a trigger for toggling on/off some automatic operations" ) ;
      $BATCHarray["axes"] = array( "cmd" => "axes",
                             "desc" => "show/hide axes for the chosen plane" ) ;
      $BATCHarray["benchmark"] = array( "cmd" => "benchmark",
                             "desc" => "show benchmark report of last drawing process" ) ;
      $BATCHarray["bip"] = array( "cmd" => "bip",
                             "desc" => "batch image processing operations" ) ;
      $BATCHarray["bk"] = array( "cmd" => "bk",
                             "desc" => "set up the console background color" ) ;
      $BATCHarray["break"] = array( "cmd" => "break",
                             "desc" => "halt batch compiler run" ) ;
      $BATCHarray["bye"] = array( "cmd" => "bye",
                             "desc" => "close the terminal console pop-up window" ) ;
      $BATCHarray["clean"] = array( "cmd" => "clean",
                             "desc" => "clean the terminal console text viewport" ) ;
      $BATCHarray["close"] = array( "cmd" => "close",
                             "desc" => "alias of bye" ) ;
      $BATCHarray["cls"] = array( "cmd" => "cls",
                             "desc" => "alias of clean" ) ;
      $BATCHarray["code"] = array( "cmd" => "code",
                             "desc" => "Write down the script listing for the current drawing process" ) ;
      $BATCHarray["color"] = array( "cmd" => "color",
                             "desc" => "set up the console text color" ) ;
      $BATCHarray["console"] = array( "cmd" => "console",
                             "desc" => "manage position and size of terminal console pop-up window" ) ;
      $BATCHarray["coords"] = array( "cmd" => "coords",
                             "desc" => "return the coordinates or center of the selected plane" ) ;
      $BATCHarray["count"] = array( "cmd" => "count",
                             "desc" => "return the current number of generators" ) ;
      $BATCHarray["debug"] = array( "cmd" => "debug",
                             "desc" => "manage debug tab contents" ) ;
      $BATCHarray["deg"] = array( "cmd" => "deg",
                             "desc" => "convert radians to degrees" ) ;
      $BATCHarray["depth"] = array( "cmd" => "depth",
                             "desc" => "return the depth value for the current process" ) ;
      $BATCHarray["die"] = array( "cmd" => "die",
                             "desc" => "close the web-app instance" ) ;
      $BATCHarray["disk"] = array( "cmd" => "disk",
                             "desc" => "manage a number of operations on the (generator) disks list" ) ;
      $BATCHarray["docs"] = array( "cmd" => "docs",
                             "desc" => "open a new window linking to these docs" ) ;
      $BATCHarray["echo"] = array( "cmd" => "echo",
                             "desc" => "toggle on/off commands return messages" ) ;
      $BATCHarray["drawby"] = array( "cmd" => "drawby",
                             "desc" => "set drawing geometric object for drawing the diagrams" ) ;
      $BATCHarray["env"] = array( "cmd" => "env",
                             "desc" => "display current environmental parameters" ) ;
      $BATCHarray["export"] = array( "cmd" => "export",
                             "desc" => "switch export options" ) ;
      $BATCHarray["fixcmd"] = array( "cmd" => "fixcmd",
                             "desc" => "set a command for automatic usage and to avoid repetitions in the next lines" ) ;
      $BATCHarray["font"] = array( "cmd" => "font",
                             "desc" => "change text font appearance and size" ) ;
      $BATCHarray["frm"] = array( "cmd" => "frm",
                             "desc" => "evaluates input complex formula" ) ;
      $BATCHarray["generator"] = array( "cmd" => "generator",
                             "desc" => "generators scheme manager" ) ;
      $BATCHarray["go"] = array( "cmd" => "go",
                             "desc" => "a trigger for refreshing the chosen plane" ) ;
      $BATCHarray["help"] = array( "cmd" => "help",
                             "desc" => "return the list of commands or help text for the chosen command" ) ;
      $BATCHarray["init"] = array( "cmd" => "init",
                             "desc" => "initialize generators according to the chosen method" ) ;
      $BATCHarray["label"] = array( "cmd" => "label",
                             "desc" => "manage labels for generators" ) ;
      $BATCHarray["layers"] = array( "cmd" => "layers",
                             "desc" => "manage the layers pile for the chosen plane" ) ;
      $BATCHarray["limitset"] = array( "cmd" => "limitset",
                             "desc" => "set construction mode to limit set" ) ;
      $BATCHarray["menu"] = array( "cmd" => "menu",
                             "desc" => "show/hide the top menu" ) ;
      $BATCHarray["method"] = array( "cmd" => "method",
                             "desc" => "return the current method of set up one" ) ;
      $BATCHarray["mobius"] = array( "cmd" => "mobius",
                             "desc" => "manage a number of operations on the (generator) mobius maps" ) ;
      $BATCHarray["new"] = array( "cmd" => "new",
                             "desc" => "set up a new environment" ) ;
      $BATCHarray["palette"] = array( "cmd" => "palette",
                             "desc" => "manage a number of operations on the current palette" ) ;
      $BATCHarray["panel"] = array( "cmd" => "panel",
                             "desc" => "manage the size of source and image panels" ) ;
      $BATCHarray["plane"] = array( "cmd" => "plane",
                             "desc" => "set up the chosen plane context as a trigger for next operations" ) ;
      $BATCHarray["plugin"] = array( "cmd" => "plugin",
                             "desc" => "plugins manager" ) ;
      $BATCHarray["probability"] = array( "cmd" => "probability",
                             "desc" => "probabilities table manager (random process mode)" ) ;
      $BATCHarray["quit"] = array( "cmd" => "quit",
                             "desc" => "alias of bye" ) ;
      $BATCHarray["rad"] = array( "cmd" => "rad",
                             "desc" => "convert degrees to radians" ) ;
      $BATCHarray["refresh"] = array( "cmd" => "refresh",
                             "desc" => "update contents in the chosen plane" ) ;
      $BATCHarray["repetends"] = array( "cmd" => "repetends",
                             "desc" => "repetends table manager" ) ;
      $BATCHarray["resources"] = array( "cmd" => "resources",
                             "desc" => "open a new tab to the chosen page of resources (listings or recipes)" ) ;
      $BATCHarray["rgb"] = array( "cmd" => "rgb",
                             "desc" => "return both the rgb formats and the associated tag, if any" ) ;
      $BATCHarray["savepix"] = array( "cmd" => "savepix",
                             "desc" => "plane capture and save it into a picture file" ) ;
      $BATCHarray["seeds"] = array( "cmd" => "seeds",
                             "desc" => "manage parameters for seeds method exclusively" ) ;
      $BATCHarray["select"] = array( "cmd" => "select",
                             "desc" => "select the element by label" ) ;
      $BATCHarray["silent"] = array( "cmd" => "silent",
                             "desc" => "toggle on/off the silent mode (i.e. skip/show questions)" ) ;
      $BATCHarray["source"] = array( "cmd" => "source",
                             "desc" => "set the source items type (seeds or generators)" ) ;
      $BATCHarray["stop"] = array( "cmd" => "stop",
                             "desc" => "halt the current multi-tasking process" ) ;
      $BATCHarray["ticks"] = array( "cmd" => "ticks",
                             "desc" => "return or set up the number of ticks for the axes in the chosen plane" ) ;
      $BATCHarray["tiling"] = array( "cmd" => "tiling",
                             "desc" => "set construction mode to tiling" ) ;
      $BATCHarray["track"] = array( "cmd" => "track",
                             "desc" => "display orbit or fixed points of the input word" ) ;
      $BATCHarray["unselect"] = array( "cmd" => "unselect",
                             "desc" => "cancel the current selection of generators" ) ;
      $BATCHarray["var"] = array( "cmd" => "var",
                             "desc" => "initialize user-defined variables for further use either in console or for scripts" ) ;
      $BATCHarray["warnings"] = array( "cmd" => "warnings",
                             "desc" => "toggle on/off the warnings in debug window" ) ;
      $BATCHarray["zoom"] = array( "cmd" => "zoom",
                             "desc" => "blow-up a portion of the chosen plane" ) ;
                   
      $_n_cmds = count( $BATCHarray ) ;          
      if ( $_n_cmds > 0 )
      {
           ksort( $BATCHarray );
      ?>
      <table cellpadding=0 cellspacing=0 valign="top">
      <tr><td COLSPAN="3">&lsquo;Circles&rsquo; offers the chance to input commands via a terminal console, with the comfort of triggering a bunch of given operations.</td></tr>
      <tr><td HEIGHT="12"></td></tr>
      <tr><td COLSPAN="3">List of commands for the terminal console</td></tr>
      <tr><td HEIGHT="3"></td></tr>
      <tr><td COLSPAN="3" STYLE="font-size:7pt;color:#707070">Type '%cmd% /h' in the terminal console to read full command help</td></tr>
      <tr><td HEIGHT="12"></td></tr>
      <?php
            foreach( $BATCHarray AS $K => $CHUNK )
            {
                  $CMD = $CHUNK['cmd'] ;
                  $DESC = $CHUNK['desc'] ;
                  ?>
                  <tr>
                      <td WIDTH="100" VALIGN="top" STYLE="font-family:courier new;color:#00C800;">&bull;&nbsp;<?php echo $CMD ; ?></td>
                      <td WIDTH="10"></td>
                      <td VALIGN="top" STYLE="color:#606060;"><?php echo $DESC ; ?></td>
                  </tr>
                  <tr><td HEIGHT="10"></td></tr>
                  <?php
            }
      ?>
      <tr><td HEIGHT="20"></td></tr>
      </table>
      <?php
      }
      ?>