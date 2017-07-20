<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var _dims = getViewportExtents();
</SCRIPT>
    <a name="interface" ID="title">Interface layouts</a><br>
    After this short background, we finally come to introduce you to
    this app visual interface. A main menu is at the top, a couple of white boxes to draw generators and
    the IFS, together with a lower bar with icons and other controls. The core purpose is just 
    to input the generators on the left and render the Kleinian group on the right.<br>
    <br><br>
    <table cellpadding=0 cellspacing=0 valign="top" align="left" STYLE="margin-right:14pt;margin-bottom:14pt;">
    <tr>
        <td valign="top">
        <IMG ONCLICK="javascript:anchorOVERimg( this.id, _dims[0] * 0.4 );" CLASS="special" ID="interfacepix01" STYLE="width:300px;" SRC="pix/interface/docs.pix.01.png">
        </td>
    </tr>
    <tr><td HEIGHT="3"></td</tr>
    <tr><td ID="contentpix_label" ALIGN="center">Default interface</td></tr>
    <tr><td HEIGHT="12"></td</tr>
    <tr>
        <td valign="top">
        <IMG ONCLICK="javascript:anchorOVERimg( this.id, _dims[0] * 0.8 );" CLASS="special" ID="interfacepix02" STYLE="width:300px;" SRC="pix/interface/docs.pix.02.png">
        </td>
    </tr>
    <tr><td HEIGHT="3"></td</tr>
    <tr><td ID="contentpix_label" ALIGN="center">Diagrams on the left</td></tr>
    <tr><td HEIGHT="12"></td</tr>
    <tr>
        <td valign="top">
        <IMG ONCLICK="javascript:anchorOVERimg( this.id, _dims[0] * 0.8 );" CLASS="special" ID="interfacepix03" STYLE="width:300px;" SRC="pix/interface/docs.pix.03.png">
        </td>
    </tr>
    <tr><td HEIGHT="3"></td</tr>
    <tr><td ID="contentpix_label" ALIGN="center">Terminal at the bottom</td></tr>
    </table>
    Here some available layouts, in case user needs to watch diagrams or to work with code.
    <br><br>
    The top menu splits into four groups of operations. Let's sketch out the most relevant entries.
    <ul>
        <li><b>Settings</b>
            <ul>
                <li>Method</li>
                    <ul>
                        <li><b>Schottky circles</b>: this is the classic approach to Kleinian groups, consisting of
                        a even number of elements, paired by each generator and its reverse map.</li>
                        <li><b>One way inversion</b>: this is another approach, similar to the Schottky
                        circles, but elements are not paired.</li>
                        <li><b>Apollonian</b>: it's used to build up the known gaskets. This is
                        a geometric construction which finds a next tangent element, given an
                        initial circles configuration. It's then open to the iterative use.</li>
                        <li><b>Seeds</b>: a variation of the Schottky circles method. But the analogy
                        solely refers to the 'reduced' words. Most relevant
                        difference is that Mobius maps have to be input here, instead of the 
                        generator disks. Hence this method does not enjoy a geometrical character,
                        but algebraic. It then likes to work on a set of starting values, usually
                        retrieved from the fixed points of special input words. Limit sets
                        are displayed exclusively.</li>
                    </ul>
                </li>
                <li>Construction mode: how we display the action of generators</li>
                    <ul>
                        <li><b>Tiling mode</b>: given a word, each step is displayed by a circle on the image plane.</li>
                        <li><b>Limit set</b>: given a word, only the last step is displayed by a point on the image plane.</li>
                    </ul>
                <li>Geometric objects: what object to use for displaying the Kleinian group</li>
                <li>Generals: these are settings affecting the whole application.
                    <ul>
                        <li><b>Panels</b>: you can resize both source and image plane for obtaining smaller or larger views, depending on what you're focusing on.</li>
                        <li><b>Options</b>: you can change the parameters for all this app.</li>
                        <li><b>Colors palette</b>: how to paint the kleinian group</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li><b>Extras</b>
            <ul>
                <li>Examples: built-in examples for all supported methods</li>
                <li>Plug-ins: components for working with special configurations of generators</li>
                <li>Import / Export recipes: one tool for saving and loading configurations to files</li>
                <li>Terminal
                    <ul>
                    <li>Console : DOS-like prompt to input configurations via command lines</li>
                    <li>Batch script compiler : another way to input the same command lines but in a code list fashion.</li>
                    </ul>
                </li>
                <li>SVG editor: renderings can be exported into the SVG image file format.</li>
                <li>Batch image processing: to render picture at arbitrary width and height, beyond screen size.</li>
            </ul>
        </li>
        <li><b>Source plane</b>
            <li>New environment</li>
            <li>Refresh</li>
            <li>Show / Hide axes</li>
            <li>Show / Hide labels (of the generators)</li>
            <li>Coordinates and zoom: set up the source plane coordinates</li>
            <li>Object: a series of services to manage the generators</li>
            <li>Switch to ...
                <ul>
                    <li>Circle mode</li>
                    <li>Freedraw mode: it allows user to draw rulers and other for inputting generators correctly</li>
                </ul>
            </li>
            <li>Layers: the source plane is rendered through a pile of layers, each one managing different objects, 
                        such as those in the freedraw mode, or the generator disks and other features</li>
            <li>Export to ... (a list of supported image file formats)</li>
            <li>Capture and save pix (of the source plane, in the selected format)</li>
        </li>
        <li><b>Image plane</b>
            <li>Refresh</li>
            <li>Show / Hide axes</li>
            <li>Coordinates and zoom: set up the image plane coordinates</li>
            <li>Layers: the image plane is rendered through a pile of layers, each one managing different objects, 
                        such as those the Kleinian groups, the orbits induced by words, fixed points and other features</li>
            <li>Capture and save pix (of the source plane, in the selected format)</li>
        </li>
        <li><b>Analysis</b>
            <ul>
                <li>Dictionary: manager of the list of words for the given running configuration</li>
                <li>Tangency: perform different operations about relationships between disks
                              (construct tangent circles to another, find intersection points,
                               computes the 4th tangent disk according to an enhanced Cartesian theorem)</li>
                <li>Transforms: perform rotations and shifts to the selected generators</li>
                <li>Word & Orbits (display orbits of the given input word in the image plane)</li>
                <li>Repetends (a words manager for seeds method only)</li>
            </ul>
        </li>
        <li><b>?</b> for infos about this application + docs</li>
    </ul>
<SCRIPT LANGUAGE="javascript" TYPE="text/javascript">
var _navigation_div_width = getOBJposition( "navigationdiv", "width" ) ;
var _contents_div_width = _dims[0] - ( _navigation_div_width + 70 ) ; 
var _interface_pix_side = _contents_div_width / 3.0 ;
$("#interfacepix01" ).css( "width", _interface_pix_side + "px" ) ;
$("#interfacepix02" ).css( "width", _interface_pix_side + "px" ) ;
$("#interfacepix03" ).css( "width", _interface_pix_side + "px" ) ;
</SCRIPT>