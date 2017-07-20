    <a name="gettingstarted" ID="title">Getting started: construction of limit sets</a><br><br>
    <SPAN CLASS="section">Words</SPAN><br>
    The construction of K, whose limit set is just a part of it, is ruled through an IFS of Mobius maps compositions
    based upon lexical representations:
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('grammar#01',220,80);" ONMOUSEOUT="javascript:anchorOUT();">letters</a>,
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('grammar#02',220,80);" ONMOUSEOUT="javascript:anchorOUT();">alphabet</a>,
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('grammar#03',220,80);" ONMOUSEOUT="javascript:anchorOUT();">words</a> and
    <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('grammar#04',220,80);" ONMOUSEOUT="javascript:anchorOUT();">dictionary</a>.<br>
    The construction works with inversion trasforms. As stated before, each generator is associated with a circle and
    then with one inversion.<br>
    First it's required to set up the generators (Mobius maps) formula and to label them in western alphabet letters.<br>
    In general,
    we have two methods to pick-up circles: one - said to <i>pair circles</i> - labelling each element and its inverse by a capital and a small letter respectively. 
    For example: a and A=a<sup>-1</sup>, b and B=b<sup>-1</sup>.<br>
    A second method, named here <i>one way inversion</i>, follows
    no particular rule so that generators are simply labelled as A, B, C, D ... .<br><br>
    Inversion requires two regions to work and these two methods just differ for the inversion disks extent.<br>
    Although in the second method we don't explicitly
    mention inverse elements, it's not hard to reframe them into a group-like configuration.<br>
    Infact, given a group, the Schottky circles inversion works with any possible given pair of bounded disks,
    mapping each one into the other: we pick up one disk and invert all other <i>desired</i> elements inside it.<br>
    In the one-way-inversion, each Mobius map relates to a circle splitting the plane into one
    (unbounded) outer and one (bounded) inner disk: so we invert the disk into
    the other again, implying that <i>all objects inside the former disk</i> 
    are mapped into the interior of the latter. No way here for what to choose: all or nothing.<br>
    <br><br>
        <table align="center" cellpadding=0 cellspacing=0 valign="top">
        <tr>
        <td ALIGN="center"><IMG ID="contentpix2" SRC="pix/getting.started/pix.01.png"></td>
        <td WIDTH="20"></td>
        <td ALIGN="center"><IMG ID="contentpix2" SRC="pix/getting.started/pix.02.png"></td>
        </tr>
        <tr><td HEIGHT="5"></td></tr>
        <tr>
        <td ID="contentpix_label">Method 1: inversion between a pair of bounded circles.</td>
        <td WIDTH="20"></td>
        <td ID="contentpix_label">Method 2: inversion between inner and outer circle.<br>The former is bounded, the other is not.</td>
        </tr>
        </table>
    <br><br>
    Whereas the limit set for one way inversion is unique, we can pull out different limit sets through the first method, depending
    on how we pair the disks.
    <br><br>
        <table align="center" cellpadding=0 cellspacing=0 valign="top">
        <tr>
        <td ALIGN="center"><IMG WIDTH="300" SRC="pix/getting.started/pix.03.png"></td>
        <td WIDTH="20"></td>
        <td ALIGN="center"><IMG WIDTH="300" SRC="pix/getting.started/pix.04.png"></td>
        </tr>
        <tr><td HEIGHT="5"></td></tr>
        <tr>
        <td VALIGN="top" COLSPAN="3">
            <table align="center" cellpadding=0 cellspacing=0 valign="top">
            <tr><td ID="contentpix_label">Schottky circles: the limit set depends upon how we pair circles.</td></tr>
            </table>
        </td>
        </tr>
        </table>
    <br><br>
    Running these IFS means to compose Mobius maps, that is, to build up a sequence of letters, termed as &lsquo;word&rdquo; 
    (say abABAAAAbbbA for schottky circles and ABCCCABBBDBBB for one way inversion). Unlike spoken words,
    reading goes from right to left. This is not one another weird idea from crazy mathematical
    minds: it's just the same order to follow when a function is applied. Given the Mobius map M1, when you
    apply M2 to M1, you write M2(M1). Again, applying M3 leads to M3(M2(M1)). If M1 : a, M2 : b, M3 : c, this
    same composition evolves as follows 1) a ; 2) ba ; 3) cba.<br>
    Words are not maps themselves, words are just models for managing the sequences
    of functions easier, either from a reading and a computational viewpoint. The magic of Mathematics stands behind
    this chance of having known models for tracting more complicate behaviors.<br>
    In what follows right below, we'll always consider a two generators Kleinian group, that is, a group consisting of two couples
    of Schottky maps.
    <br><br>
    <SPAN CLASS="section">Towards a dictionary</SPAN><br>
    Let's start to think about that a word is just a sequence of letters, disjoint from meaning. Let's consider also that your home dictionary 
    consists of a finite number of tomes (usually one). Why ? Even for Kleinian groups, we need a similar set of works making sense, according to a conventional meaning.<br><br>
    Thus we can speak of a dictionary related to a Kleinian group. From another viewpoint, the analogy stops here:
    whereas spoken words must be relatively short for meeting human mnemonic limitations, words of Kleinian groups could potentially not. In practice,
    limitations are the <a CLASS="info" ONMOUSEOVER="javascript:anchorOVER('grammar#05',280,80);" ONMOUSEOUT="javascript:anchorOUT();">higher computer memory capabilities</a> and 
    the required sharp level of computation. All in all, no language can work without memory!<br><br>
    Words formulation shall obey some rules here too. The main one for any inversion method 
    is &lsquo;reducibility&rsquo;. Let's consider these special lengthed-2 words aA, bB, Aa, bB (Schottky circle inversion). They are compositions of maps being the inverse of
    each other:<br>
    &bull;&nbsp;in terms of vectors (geometrically), these compositions make us start from and get back to the same source point;<br>
    &bull;&nbsp;in algebraic terms, one such word returns the identity element.<br>
    We want very efficient graphic performances for IFS and we don't need to get back and forth this way. So the related word, say bB, can be cancelled out
    without affecting the behavior of our IFS.<br><br>
    
    For example, let aabAaB (Schottky circles) and read it from right to left : as Aa cancel out, we get aabB.
    Again, bB cancels out and we finally get aa.<br>
    On the contrary, any word, not including cancellation pairs, is termed as &lsquo;reduced&rsquo; (example: abABAAAAbbbA). 
    The dictionary construction, coming before the graphic rendering, shall take care of skipping to code reducible words.<br>
    There is no such analogue cancelling construction for one way inversion.<br><br>
    <SPAN CLASS="section">Of words and orbits</SPAN><br>
    It comes by itself that this lexical model, working with Mobius maps, enjoys both geometrical and algebraic meanings. We have
    already associated a word to a pointwise travel, while dealing with the special word aA. 
    As we run along the word abABAAAAbbbA, we apply Mobius map repeteadly, driving along a sequence of points, which is defined the &lsquo;orbit&rsquo;.<br>
    We start from an arbitrary seed point z<sub>0</sub>. Running along the sequence of letter in a given word, say <u>aBAbbAAbb</u>, we step forward and
    mark the n-th step on the complex plane by a (x,y)-point z<sub>n</sub>:<br><br>
    <table align="center" ID="contenttable">
    <tr><td>Step</td><td WIDTH="24"></td><td>We reach to</td><td WIDTH="24"></td><td>n-th point</td></tr>
    <tr><td>0th: the seed point</td><td WIDTH="24"></td><td>aBAbbAAbb</td><td WIDTH="24"></td><td>z<sub>0</sub></td></tr>
    <tr><td>1st step</td><td WIDTH="24"></td><td>aBAbbAAb<b>b</b></td><td WIDTH="24"></td><td>z<sub>1</sub></td></tr>
    <tr><td>2nd step</td><td WIDTH="24"></td><td>aBAbbAA<b>bb</b></td><td WIDTH="24"></td><td>z<sub>2</sub></td></tr>
    <tr><td>3st step</td><td WIDTH="24"></td><td>aBAbbA<b>Abb</b></td><td WIDTH="24"></td><td>z<sub>3</sub></td></tr>
    <tr><td>...</td><td WIDTH="24"></td><td>...</td></tr>
    <tr><td>n-th step</td><td WIDTH="24"></td><td><b>aBAbbAAbb</b></td><td WIDTH="24"></td><td>z<sub>n</sub></td></tr>
    <tr><td COLSPAN="5" HEIGHT="5"></td></tr>
    <tr><td COLSPAN="5" ALIGN="center" ID="contenttable_label">Words and orbits</td></tr>
    </table>
    <br>
    Geometrically, any word relates to the concept of &lsquo;orbit&rsquo;. We will use geometric two primitive entities to draw orbits: 
    circles and points.<br>
    &bull;&nbsp;Circles are fine to watch and easy to
    code (just a center and radius are required); they also fit the conformality of inversion Mobius maps: 
    figures under Mobius maps are not distored (the image of a circle is again a circle). Last but not least, 
    we need a two-dimensional figure whose
    area will shrink progressively under the action of the orbit up to the limit set. The shrinking
    effect enlightens the dynamical aspects. None would stop us to do the same with points, triangles,
    squares anyway: it's just a matter of convention.
    <br>
    &bull;&nbsp;Points have no extension, nor dimension, just a location. Losing most properties of figures by contraction, points
    represent the extremal crunch for any n-th dimensional entity and thus they fit the concept of the limit set for a dynamical system. 
    <br><br>
    How many orbits are required to render a Kleinian groups ? It depends on the required accuracy.<br>
    How to technically compute the orbits ? The above symbolic dynamics and rules of letters and words allow
    the construction of tree-like algorithms to walk down into the word until a given stopping condition
    is met.<br>
    I liked to adopt a depth parameter and compute all reduced words of given depth (=length). In addition, some
    geometric conditions, such as the radius of the n-th circle, is also used for special cases, for example of overlapping
    generator disks: they are two solutions to prevent infinite loops.
    <br><br><br>