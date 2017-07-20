<a name="recipes" ID="title">Listings and recipes</a><br><br>
There is a couple of repositories with some source material to render examples of
Kleinian groups through the given methods and formulas.<br><br>
We have here then:<br>
<ol>
<li>Listings : files of source code to copy and paste into the terminal batch compiler</li> 
<li>Recipes : files of settings to upload and automatically run</li> 
</ol>
<br><br>
<table cellpadding=0 cellspacing=0 valign="top">
<tr><td HEIGHT="20"></td></tr>
<tr><td STYLE="font-size:12pt;color:#343434;">What is a <b>listing</b> ?</td></tr>
<tr><td HEIGHT="5"></td></tr>
<tr><td COLSPAN="3">Definition: a listing is flow of commands. Each command manages a specific context of properties:
it validates input data and checks whether properties don't conflict with each other in the same context or in relation to other commands. In some
cases, a command may prompt the user for options.</td></tr>
<tr><td HEIGHT="10"></td></tr>
<tr>
    <?php $CODE = file_get_contents( $PATH_TO_CIRCLES."listings/one.way.inversion/listing.inversion.01.txt" ) ;
          $CODE = trim( utf8_encode( $CODE ) );
    ?>
    <td VALIGN="top" ID="codewindow"><pre><?php echo $CODE ; ?></pre></td>
    <td WIDTH="5"></td>
    <td VALIGN="top"><IMG WIDTH="200" SRC="<?php echo $PATH_TO_CIRCLES ; ?>listings/one.way.inversion/listing.inversion.01.png"></td>
</tr>
<tr><td HEIGHT="10"></td></tr>
<tr>
    <td VALIGN="top" COLSPAN="3" STYLE="padding:3px;background-color:#FAFAFA;">In this second example, it is
    shown a <b>listing</b> of code for computing a kleinian group originated from tiling the disks through the method
    of circles inversion.<br>
    In this enviroment, users have lot of more freedom than recipes and they would like to discover all available
    commands. Alike in the dialog boxes, users can define parameters for disks and mobius maps. Anyway,
    this text-like approach allows faster changes, because all settings are set directly in the listing and
    thus users have not to jump back and forth along the screen interface for changes.<br>
    (At the time of writing, I'm going to develop a small parser for users to compute mobius maps parameters
     via expressions of complex numbers.)</td>
</tr>
</table>
<br><br><br>