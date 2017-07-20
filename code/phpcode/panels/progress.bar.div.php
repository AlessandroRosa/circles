<?php $PATH_TO_ROOT = $_glob_S['PATH_TO_ROOT'] ; ?>
<DIV ID="PROGRESSbarDIV" CLASS="popup_wnd"
     STYLE="z-index:10010;
            -moz-opacity:0.95;
            opacity:0.95;
            filter:alpha('opacity=95');
            display:none;
            top:100px;
            width:auto;
            position:absolute;
            background-color:white;
            border:1px solid #97BAEC;
            padding:1px;">
<table cellpadding=0 cellspacing=0 valign="top" WIDTH="100%">
<tr><td VALIGN="top" STYLE="background-color:#F0F0F0;padding:3px;" ONMOUSEOVER="javascript:this.style.cursor='pointer';">
    <table cellpadding=0 cellspacing=0 valign="top" WIDTH="100%">
    <tr><td HEIGHT="4"></td></tr>
    <tr>
        <td WIDTH="3"></td>
        <td WIDTH="auto" ID="PROGRESSbarDIVtext" STYLE="font-size:7pt;color:#849BB1;">Progress bar</td>
        <td WIDTH="10"></td>
        <td WIDTH="auto" ID="PROGRESSbarDIVstep" STYLE="font-size:7pt;color:#4B86C1;"></td>
        <td WIDTH="10"></td>
        <td WIDTH="auto" ID="PROGRESSbarDIVappend" STYLE="font-size:7pt;color:#4B86C1;"></td>
        <td WIDTH="5"></td>
        <td WIDTH="12" ID="PROGRESSbarDIVcloseICON" CLASS="link" ALIGN="center" ALIGN="right" ONCLICK="javascript:circles_lib_progressbar_div_show(NO);"><IMG TITLE="Close" SRC="<?php echo $GLOBALS['PATH_TO_SUPPORT'] ; ?>img/icons/close/close.icon.01.12x12.png"></td>
        <td WIDTH="3"></td>
    </tr>
    <tr><td HEIGHT="4"></td></tr>
    </tr>
    </table>
    </td>
</tr>
<tr><td HEIGHT="1" STYLE="background-color:#DEDEDE;"></td></tr>
<tr>
    <td VALIGN="top">
    <table cellpadding=0 cellspacing=0 valign="top" WIDTH="100%">
    <tr><td HEIGHT="6"></td></tr>
    <tr>
        <td WIDTH="5"></td>
        <td WIDTH="60"><INPUT TYPE="button" VALUE="Stop" CLASS="button" STYLE="height:22px;width:60px;" ONCLICK="javascript:CIRCLESmultithreadingSTOPworker();"></td>
        <td WIDTH="10"></td>
        <td WIDTH="400"><progress id="progressbar" value="0" min="0" max="100" STYLE="width:400px;height:26px;"></progress></td>
        <td WIDTH="5"></td>
        </td>
        <td WIDTH="5"></td>
    </tr>
    <tr><td HEIGHT="12"></td></tr>
    </table>
    </td>
</tr>
</table>
</DIV>