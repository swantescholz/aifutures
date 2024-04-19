

const NODES_STR = `
s;sstart;8;4;START|HERE|
n;ntry-stop1;10;6;Humanity permanently fully stops frontier AI development soon?
a;adune;12;6;"Dune"-scenario: Advanced AI is permanently banned.
i;iresearch-continues;8;8;AI research continues
n;ncapabilities-improve;8;10;Will frontier AI capabilities continue to improve?
a;aai-winter;6;10;Permanent AI winter
i;ireach-catastrophic-potential;10;8;Frontier AI reaches capabilities with catastrophic potential.
n;ncatastrophe;10;10;pre-AGI catastrophe occurs (e.g. AI misuse via cyber- or bio-weapons)?
i;ccatastrophy-occurs;11.2;8;pre-AGI catastrophe does occur!
n;ntry-stop2;12;10;Humanity permanently fully stops frontier AI development (after catastrophe)?
n;ntry-slow;12;12;Humanity agrees to advance AI only extremely carefully to avoid risks?
n;nenforce-slow;12;14;Can Humanity enforce this slow/careful approach globally?
g;gagi-utopia;12;16;(Slightly delayed) AGI utopia
i;iagi-exists;10;14;Research towards AGI continues. First AGI exists
n;nagi-transformative;8;14;Is AGI transformative?
a;anon-transformative-agi;8;12;Powerful, but not transformative AGI.
n;nprevent-other-agis;6;12;Will the first AGI prevent other AGIs to appear?
n;nagis-collaborate;4;12;Will AGIs collaborate with each other?
i;iconflicting-agis;4;10;Conflicting AGIs
n;nconflicting-agi-survive;4;6;Will humanity survive among conflicting AGIs?
e;econflicting-agi-xrisk;4;4;Extinction from conflicting AGIs
a;aconflicting-agi-survive;6;4;Uncertain future among conflicting AGIs
n;nalignment-theory;6;14;Have we solved AGI alignment in theory?
n;nimplement-alignment;6;16;Do AI labs implement alignment correctly?
i;ialigned-agi;4;16;Aligned AGI
n;nwhole-humanity-aligned;4;18;Is AGI aligned with humanity's interests as a whole?
g;gagi-utopia2;4;20;AGI utopia
n;ncontrollers-thoughtful;6;18;Are AGI controllers thoughtful regarding unintended consequences?
n;nagi-protects;8;20;Does AGI protect its users?
e;estupid-xrisk;8;22;Accidental/stupid human extinction
n;ncontrollers-good;6;20;Do AGI controllers have good intentions?
e;eauthoritarian-dystopia;6;22;Authoritarian dystopia
i;imisaligned-agi;8;16;Misaligned AGI
n;nfigure-misaligned;8;18;Do we figure out it's misaligned?
n;nturn-off;10;18;Can we easily turn it off?
a;asecond-chance;12;18;We get a second chance at building AGI
n;nharming-us;10;20;Is it harming us?
n;ncan-destroy-it;12;20;Can we destroy it?
n;nbenefit-extinction;12;22;Does it benefit from our extinction?
e;eagi-kills-us;12;24;AGI-initiated human extinction
n;nbenefit-suffering;10;24;Does it benefit from our suffering?
e;emedium-dystopia;10;22;Medium-scale dystopia
e;esuffering;8;24;Astronomical suffering
`.trim();

const EDGES_STR = `
-;sstart;ntry-stop1
y;ntry-stop1;adune
n;ntry-stop1;iresearch-continues
-;iresearch-continues;ncapabilities-improve
y;ncapabilities-improve;ireach-catastrophic-potential
n;ncapabilities-improve;aai-winter
-;ireach-catastrophic-potential;ncatastrophe
y;ncatastrophe;ccatastrophy-occurs
-;ccatastrophy-occurs;ntry-stop2
y;ntry-stop2;adune
n;ntry-stop2;ntry-slow
y;ntry-slow;nenforce-slow
n;ntry-slow;iagi-exists
y;nenforce-slow;gagi-utopia
n;nenforce-slow;iagi-exists
n;ncatastrophe;iagi-exists
-;iagi-exists;nagi-transformative
n;nagi-transformative;anon-transformative-agi
y;nagi-transformative;nprevent-other-agis
n;nprevent-other-agis;nagis-collaborate
y;nprevent-other-agis;nalignment-theory
n;nagis-collaborate;iconflicting-agis
y;nagis-collaborate;nalignment-theory
-;iconflicting-agis;nconflicting-agi-survive
n;nconflicting-agi-survive;econflicting-agi-xrisk
y;nconflicting-agi-survive;aconflicting-agi-survive
y;nalignment-theory;nimplement-alignment
n;nalignment-theory;imisaligned-agi
n;nimplement-alignment;imisaligned-agi
y;nimplement-alignment;ialigned-agi
-;ialigned-agi;nwhole-humanity-aligned
n;nwhole-humanity-aligned;ncontrollers-thoughtful
y;nwhole-humanity-aligned;gagi-utopia2
n;ncontrollers-thoughtful;nagi-protects
y;ncontrollers-thoughtful;ncontrollers-good
y;nagi-protects;ncontrollers-good
n;nagi-protects;estupid-xrisk
n;ncontrollers-good;eauthoritarian-dystopia
y;ncontrollers-good;gagi-utopia2
-;imisaligned-agi;nfigure-misaligned
y;nfigure-misaligned;nturn-off
n;nfigure-misaligned;nharming-us
y;nturn-off;asecond-chance
n;nturn-off;nharming-us
y;nharming-us;ncan-destroy-it
n;nharming-us;asecond-chance
y;ncan-destroy-it;asecond-chance
n;ncan-destroy-it;nbenefit-extinction
y;nbenefit-extinction;eagi-kills-us
n;nbenefit-extinction;nbenefit-suffering
y;nbenefit-suffering;esuffering
n;nbenefit-suffering;emedium-dystopia
`.trim();

// Edge types
const YES = 'y';
const NO = 'n';
const E100 = '-';

// Node types
const NORMAL = 'n';
const START = 's';
const GOOD = 'g';
const AMBIVALENT = 'a';
const EXISTENTIAL = 'e';
const INTERMEDIATE = 'i';

// Map from node type to color
const COLORS = {
    [NORMAL]: 'rgb(255, 255, 255)',
    [START]: 'rgb(114, 158, 240)',
    [GOOD]: 'rgb(97, 247, 115)',
    [AMBIVALENT]: 'rgb(244, 244, 99)',
    [EXISTENTIAL]: 'rgb(223, 94, 55)',
    [INTERMEDIATE]: 'rgb(168, 191, 171)',
};

// IDs
const idTableTotalForTypeP = 'idTableTotalForTypeP';
const idTableNodeCellP = 'idTableNodeCellP';
const idNodeBoxDiv = 'idNodeBoxDiv';
const idNodeTextDiv = 'idNodeTextDiv';
const idSliderInput = 'idSliderInput';
const idSliderNumberBox = 'idSliderNumberBox';
const idEdgeLabel = 'idEdgeLabel';
const idDetailPlot = 'idDetailPlot';
const idTotalPlot = 'idTotalPlot';

// Other constants
const XSCALE = 1.0;
const SLIDER_DEFAULT_VALUE = 50;
const TABLE_NODE_TYPES_WITH_TOTAL = [EXISTENTIAL, AMBIVALENT, GOOD];
const TABLE_NODE_TYPES = [EXISTENTIAL, AMBIVALENT, GOOD];
const TABLE_HEADERS = ["Existential Catastrophe", "Ambivalent Outcome", "Good Outcome"];
const CANVAS_PADDINGW = 100;
const CANVAS_PADDINGH = 50;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1200;
