<STYLE TYPE="text/css">
.loading_cell
{
    font-family:lucida grande,tahoma,verdana,arial,sans-serif;
    font-size:8pt;
}

.loading_div
{
    position:absolute;
    -moz-opacity:0.7;
    opacity:0.7;
    filter:alpha(opacity=70);
    z-index:2;
    
    top:200px;
    left:0px;
    width:100%;
    height:auto;
}

.loading_table
{
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;

    -webkit-box-shadow: 0px 0px 12px 0px #565656;
    -moz-box-shadow: 0px 0px 12px 0px #565656;
    box-shadow: 0px 0px 12px 0px #565656;
    
    background-color:#F0F0F0;
    width:480px;
}
</STYLE>
<DIV ID="LOADINGwaitDIV" ALIGN="center" CLASS="loading_div">
<table ALIGN="center" CLASS="loading_table">
<tr><td HEIGHT="24" COLSPAN="5"></td></tr>
<tr><td ROWSPAN="8" WIDTH="15"></td>
    <td ROWSPAN="8" WIDTH="110" ALIGN="center" VALIGN="top"><IMG SRC="<?php echo $WAITimgPATH ; ?>"></td>
    <td ROWSPAN="8" WIDTH="25"></td>
    <td ALIGN="center" STYLE="font-size:14pt;color:#565656;"><b><?php echo $LOADINGdivTITLE ; ?></b></td>
    <td ROWSPAN="8" WIDTH="25"></td>
</tr>
<tr><td HEIGHT="6"></td></tr>
<tr><td ALIGN="center" STYLE="font-size:11pt;"><?php echo $LOADINGdivSUBTITLE ; ?></td></tr>
<tr><td HEIGHT="12"></td></tr>
<tr><td ALIGN="center" STYLE="font-size:11pt;">Last release date : <?php echo $LOADINGdivRELEASEDATE ; ?></td></tr>
<tr><td HEIGHT="24"></td></tr>
<tr><td ALIGN="center" STYLE="font-size:11pt;"><?php echo $LOADINGdivMESSAGE ; ?></td></tr>
<tr><td HEIGHT="24" COLSPAN="5"></td></tr>
</table>
</div>
<?php ob_flush(); flush(); ?>