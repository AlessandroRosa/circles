    <a name="basicterminology" ID="title">Basic terminology</a><br><br>
    Here below I'll give some concepts and definitions as a basis to what follows. These docs don't claim to be rigorous and exhaustive. Refer to maths textbooks instead.<br><br>
    <SPAN CLASS="section">Definition of group</SPAN><br>
    <span ID="definition">Let L be a set endowed with an operation &#186;.<br>
    &bull;&nbsp;Given a, b in L, then a &#186; b belongs to L;<br>
    &bull;&nbsp;given any element a of L, there exists a unique element i in L so that a &#186; i = i &#186; a = a holds;<br>
    &bull;&nbsp;given three elements a, b, c of L, then (a &#186 b) &#186 c = a &#186 (b &#186 c);<br>
    &bull;&nbsp;given a in L, there exists an element b of L so that a &#186; b = i.</span><br><br>
    Then L is an algebraic structure, known as group.
    <br><br>
    <SPAN CLASS="section">Complex Mobius maps</SPAN><br>
    <span ID="definition">A Mobius map is a function in the form (az+b)/(cz+d), where the parameters a,b,c,d and the unknown z
    are complex numbers.</span><br>
    Let M be the set of complex Mobius maps. M is a group: given two such maps M1 and M2, M1(M2) = M3 is again a Mobius map as well as the reverse of M3. Moreover,
    we have M1(M2(M3)) = M3(M1(M2)).<br><br>
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('mobiusmaps#01',210,50);" ONMOUSEOUT="javascript:anchorOUT();">Mobius maps</a>
    reveal as a spring of wonders for mathematicians: analysts found them useful to solve certain linear differential
    equations and geometers showed that such maps can play as the dictionary of elementary transformations in the complex plane. 
    With suitable values of their four coefficients, Mobius maps turn into rotations,
    translations, dilations, contractions and <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('inversion#01',210,50);" ONMOUSEOUT="javascript:anchorOUT();">inversions</a> all over the <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('riemannsphere#01',290,150);" ONMOUSEOUT="javascript:anchorOUT();">Riemann sphere</a>.<br>
    (Complex) Inversion is the key to open the door to Kleinian groups.
    <br><br>

    <SPAN CLASS="section">Limit sets of Kleinian groups</SPAN><br>
    A <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('kleiniangroup#01');" ONMOUSEOUT="javascript:anchorOUT();">Kleinian group</a> 
    is a discrete group K of Mobius maps (renamed here as &lsquo;generators&rsquo;). Each generator matches to one only circle (for inversion). The term &lsquo;discrete&rsquo; means
    that we can count its elements.<br>
    Displaying K needs to run a <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('ifs#01');" ONMOUSEOUT="javascript:anchorOUT();">IFS</A> dynamical system and 
    therefore understanding the stability of K becomes crucial: what is the final state of K ?<br> 
    It's the so-called &lsquo;<a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('attractor#01');" ONMOUSEOUT="javascript:anchorOUT();">attractor</A>&rsquo; 
    or the &lsquo;limit set L of a Kleinian group&rsquo;.
    <br>
    Generators groups are classified according to the shape of L. If they are circles, we have Fuchsian groups. For kinky and convoluted curves with no fixed points
    we have quasi-Fuchsian groups. Limit sets of Schottky groups are scattered dust of points. Finally limit sets with fixed points 
    arise in special configurations, like in the Maskit slice, for example. Each group class is ruled
    by special relations between the coefficients of the Mobius maps. In the pictures below, we took up four generator circles. By tuning their size and position, we
    come to different limit sets.
    <br><br>
    <table align="center" cellpadding=0 cellspacing=0 valign="top">
    <tr><td HEIGHT="15"></td></tr>
    <tr><td ALIGN="center">Generators and limit sets</td><tr>
    <tr><td HEIGHT="15"></td></tr>
    <tr>
        <td VALIGN="top">
        <table align="center" cellpadding=0 cellspacing=0 valign="top">
        <tr>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.01.png"></td>
        <td WIDTH="20"></td>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.02.png"></td>
        <td WIDTH="20"></td>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.07.png"></td>
        </tr>
        <tr><td HEIGHT="5"></td></tr>
        <tr>
            <td ID="contentpix_label">A Fuchsian group.</td>
            <td WIDTH="20"></td>
            <td ID="contentpix_label">A quasi-Fuchsian group (#1).</td>
            <td WIDTH="20"></td>
            <td ID="contentpix_label">A quasi-Fuchsian group (#2).</td>
        </tr>
        </table>
        </td>
    </tr>
    <tr><td HEIGHT="25"></td></tr>
    <tr>
        <td VALIGN="top">
        <table align="center" cellpadding=0 cellspacing=0 valign="top">
        <tr>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.03.png"></td>
        <td WIDTH="20"></td>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.08.png"></td>
        <td WIDTH="20"></td>
        <td><IMG ID="contentpix" SRC="pix/basic.terminology/docs.pix.05.png"></td>
        </tr>
        <tr>
        <td ID="contentpix_label">A Schottky group.</td>
        <td WIDTH="20"></td>
        <td ID="contentpix_label">Limit set with fixed points<br>(Maskit slice of 1-punctured torus).</td>
        <td WIDTH="20"></td>
        <td ID="contentpix_label">A limit set in the Riley slice.</td>
        </tr>
        </table>
        </td>
    </tr>
    </table>
    <br>
    As we wrote earlier, Mobius maps play an important role in linear differential equations. It's not then surprising to
    find <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('poincare');" ONMOUSEOUT="javascript:anchorOUT();">Henri Poincaré</A> together with 
    the other pioneers in this topic, <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('fricke');" ONMOUSEOUT="javascript:anchorOUT();">Robert Fricke</A>,
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('fuchs');" ONMOUSEOUT="javascript:anchorOUT();">Lazarus Fuchs</A>,
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('klein');" ONMOUSEOUT="javascript:anchorOUT();">Felix Klein</A> and 
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('schottky');" ONMOUSEOUT="javascript:anchorOUT();">Friedrich Schottky</A>.
    It was Poincaré himself to coin the terms &lsquo;Kleinian&rsquo; and &lsquo;Fuchsian groups&rsquo;.
    <br><br>
    
    <SPAN CLASS="section">A brief historical remark<br>
    <SPAN STYLE="font-size:7pt;">(or everything may happen in the continuum of the complex numbers !)</SPAN>
    </SPAN><br>
    Even a far-looking scientist may have some firm, irrevocable standpoints. It's curious to notice that pioneering Poincar&eacute;'s 
    approach to groups was geometrical and just led him to circle-shaped limit sets. Luckily to him, he didn't see that later research - starting to rely upon algebraic methods -
    discovered that these limit curves may be &lsquo;monstrous&rsquo;, as he
    nicknamed those pathological cases, arising for particular complex Taylor series.<br>
    Please, refer to the entry 5 in the links list of <A CLASS="info" HREF="?a=externallinks">my refs</A> for some more details.<br><br>

    Time is unstoppable and, along this flow, Past, Present and Future are in everlasting friction: <i>panta rei</i> ... things are always changing; if
    we don't trust in this, we could result obsolete before we start with something.<br>
    The spin of old school had run out after its pioneering action. Being officially interested in formulas
    arising from real problems exclusively, this noble trend couldn't resist to the barbaric (!) clash upsetting
    the current Analysis: younger researchers longed to get rid of classic ties and to deal with maximal generalization and abstraction.
    And really their results were unexpectedly consistent and didn't lack of rigor. But years should pass before becoming to credible
    to audience. The old school of analysts could not stand the raids, committed by new generation, 
    against the dogmas of derivability, of continuity and of linear dimension, which represented the bedrock of their mathematical
    background up to then and trusted to be intimate characters of geometric curves. How could a
    one-dimensional curve fill a bi-dimensional region? How could a curve be not differentiable? What could its shape be then?<br>
    On the front of pure numbers, Cantor's discoveries were resetting Number Theory to the wider scenario of irrational
    numbers and continuous sets.
    <br><br>
    Maths was doomed to be broken up into pieces and re-framed into a more coherent structure. Poincaré lived enough to see the snaking Peano's curve filling an area
    and the non-differentiable Koch curve. But not too long to witness the wild incursions by Fatou and by Julia, riding
    the dynamics of complex functions over the Riemann sphere. Ha! Probably he wouldn't survive so much bravery!<br><br>
    The concept of self-similarity and fractal shapes were far to be rigorously defined, but someone had already seen that these
    results manifested strong connections between, as <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('hausdorff');" ONMOUSEOUT="javascript:anchorOUT();">Felix Hausdorff</a> for example.
    <br><br><br>