    <a name="circles" ID="title">Introduction</a><br><br>
    &lsquo;Circles&rsquo; is a web application, whose goal is to offer a (relatively) simple interface to handle Kleinian groups and
		to work out complicate configurations too.<br>
    It is intended as an early development, so it features a very basic set of analysis tools by now.<br>
		Suggestions and bugs reports are appreciated.<br>
    This app offers a <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('kleiniangroup#02',260);" ONMOUSEOUT="javascript:anchorOUT();">double entry level</a>, either for beginners and for experts.<br>
    Depending on the Kleinian group in question, one could opt to simply start from the generator circles or from setting up
    the parameters of its Mobius maps. Theoretically, both paths are compatible. In practice, finding the correct circles
		coordinates is simple for trivial cases exclusively, whereas more interesting cases demand user to conveniently deal
		with Mobius maps parameters.<br>I deliberately didn't mention drawing yet: infact, it's a process being susceptible of variations
		and shall be treated with caution. Therefore it will be developed as this documentation will go deep into concepts and definitions.<br><br> 
    
    <SPAN CLASS="section">Some technical concepts (... for developers!)</SPAN><br>
    &lsquo;Circles&rsquo; runs as a client-side web-app(lication). It's mixture of HTML for graphic interface, of Javascript - bulking
		any kind of management (forms, drawings), plus very little pieces of PHP for pre-processing and initialization.<br>
		Web software environments may become, in my opinion,
    the definitive scenario for quick and robust developments for applications based upon high level languages. 
    If seen in a range of last 8 years, web languages are evolving so much to allow a quick implement of services today. What
		was commonly available for stand-alone programs only, it happened for a web browser too. Although limited by fair Internet security directives and unjust compromises of cross-browser code.<br><br>
		Web became a context with its own, strong identity and thus urging to be looked after.<br> 
		On one way, languages are becoming faster and richer of native functions. On the
		other, we are seeing the proliferation of libraries for simplifying the writing of code: Jquery represented the pioneering solution
		in this direction and made it real what was the general need of collecting most used routines into a portable bunch. You can now
		glue that library to your project and the activation of long portions of code simply recapitulates into one function call, for example.<br>
    Moreover web-apps are architecture independent and they represent a new, great chance for software distribution.<br>
    &bull;&nbsp; PROs: no more efforts to implement specific code for different platforms, graphic interface is easier to set up, 
    local client-server environment can be installed in few minutes.<br>
    &bull;&nbsp; CONs: at present interpreted languages are reknown for speed drawbacks, if compared to compiled code. 
    Anyway &lsquo;Circles&rsquo; succeeds to run fast enough on latest machines.<br><br>
    [I hope that Future will never allow to work at low-levels (handling file-system, serial ports, ...), compromising
    one of the fundamental Web security directive: don't mess up with PC internals!]<br>
    Developing &lsquo;Circle&rsquo; was fun indeed: first I coded the classes for basic objects of primitives 
    (complex numbers, Mobius maps, circle, line, rectangle, point) 
    plus a complex plane-to-screen coordinates mapper. As I was done with the main chunk of the whole code, I felt more relaxed and I begun to
    fix several details. Last but not least, the further examples in these docs represented an inspiration for additional developments.<br><br>
    
    <SPAN CLASS="section">On my background</SPAN><br>
    As for several people focusing on Kleinian groups since 2002, my modest background knowledge sources from
    Indra's Pearls too, a book enjoying the merit of opening this topic to a wider audience than
    of insiders only, thanks to an easy approach with fun tones too. Right in 2002, I was working on my book <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('earlydays#01',200);" ONMOUSEOUT="javascript:anchorOUT();">&lsquo;Early Days in
    complex dynamics &rsquo;</a>. The close geometric resemblances to complex Julia sets sparkled my curiosity: I wanted to
    explore them too.<br>
    In that same period, I had already coded another app (namely, &lsquo;Inwards to Chaos&rsquo;, coded in in Visual C++ and running as stand-alone) to iterate
    complex dynamical systems in one variable. Then I considered that ...
    &ldquo;I can do it for Kleinian groups too ! &rdquo;. The masterplan I followed for &lsquo;Circles&rsquo; dates back to the 
    one I have been keeping in mind since those same early times.<br>
    Anyway my book and job duties distracted me, so that this &lsquo;Circles&rsquo; project laid dormant up to June 2013 when,
    luckily, I felt ready to focus on Kleinian groups again. I can perfectly recall that Sunday afternoon,
    when I jumped out of my sofa and I decided to embark on this project, writing the first small 
    pieces of code (namely, mobius maps and geometric primitives).<br><br>
    
    <SPAN CLASS="section">Iterations and IFS</SPAN><br>
    Both Julia set and Kleinian groups lie on the complex plane and their geometries enjoy fractal properties. Sometimes they may also look like having a similar shape.<br>
    Their constructions result from dynamical systems based upon two different strategies anyway.<br>
    Julia sets are constructed iteratively and pointwise: a simple approach, where each point (seed) is picked up and input into a complex function,
    which is applied iteratively</a>. The orbit of resulting points
		is a (often, broken) line. All goes straight during the iteration: no forks, no decisions, just go ahead, up to destination. And, for the whole picture, the more seeds you pick, 
    the sharper you'll get it. That's all !<br>
		<br>Kleinian groups are worked out by <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('ifs#01',200);" ONMOUSEOUT="javascript:anchorOUT();">IFS</A>.
    It's completely different from iteration: according to the rigid laws of the tree-shaped structures, we realize that one has to start from the root
		to reach each leaf: infact, each node has a parental dependence from the previous one, along paths starting from the root node. In computational terms, each node
    has a (complex) value, which can be inferred by walking each branch down exclusively.<br>
		The IFS brings in decisions, because each branch works like a forkroad. The IFS looks like a tree for its structure and acts like a maze with forks for its walking.<br>
		One just knows where one stands while crossing each node, but one can't grasp a precise map of the journey, without collecting all nodes. Therefore
		one has to walk the paths back and forth, try to transverse each fork and finally grab some conclusions
		from the resulting collection. It is definitely more expensive in terms	of computational costs than iteration.<br><br>
		For example, the reader may consider that blowing-up a Julia set 
    just needs to compute orbits from those seeds inside a bounded region in the complex plane, but zooming in a Kleinian group 
    needs to compute the entire figure again, with care of displaying only those elements lying inside that region. In the second case, finding tips or strategies to save the computation time
    is the ultimate challenge for the developer: the building of the whole tree may be
		speeded up by replace time-consuming recursive calls with equivalent loops or be completely skipped if no radical
		changes occur (number of generators, words length for example) since the last building. In the graphic context, one just plots the portions inside the visible region only.
    <br><br>
    <table cellpadding=0 cellspacing=0 valign="top" ALIGN="center">
    <tr>
        <td><IMG ID="contentpix" SRC="pix/circles/docs.pix.06.2.png"></td>
        <td WIDTH="15"></td>
        <td><IMG ID="contentpix" SRC="pix/circles/docs.pix.06.1.png"></td>
    </tr>
    <tr><td HEIGHT="4"></td></tr>
    <tr><td COLSPAN="3" ID="contentpix_label" ALIGN="center">Resemblances between a Julia set (left) and a Kleinian group (right)</td></tr>
    </table>
    <br><br>
    
    <SPAN CLASS="section">Disclaimer</SPAN><br>
    The reading of further pages require some Maths background. I won't/can't get deep down into details, because of
    Kleinian groups are a new topic for me too and my goal here is just to show how you can play with
    them at different levels of complication (and satisfaction).<br><br>