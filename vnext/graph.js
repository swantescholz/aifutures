const AUTHORS_ESTIMATES = "50i70i55i95i55i95i75i65i40i65i20i60i75i75i10i30i95i3i97i4";
const NODES_STR = `
s;sstart;4;6;START|HERE|
a;adune;12;6;Advanced AI is permanently banned
n;ncapabilities-plateau;4;8;Will current AI approaches plateau before AGI-level capabilities?
n;nnew-approaches;6;10;Will new approaches unlock AGI-level capabilities?
a;aai-winter;4;10;Permanent AI winter
n;npause;6;8;Will we pause AI capabilities research before AGI?
i;ipause;8;6;Pause allows more safety research and other precautions
n;ncontinue;10;6;Will we continue AI capabilities research after a pause?
i;ireach-catastrophic-potential;10;8;Frontier AI reaches capabilities with catastrophic potential
n;ncatastrophe;10;10;Does a pre-AGI catastrophe occur (e.g. AI misuse via cyber- or bio-weapons)?
i;icatastrophy-occurs;12;12;Pre-AGI catastrophe does occur!
i;iagi-exists;10;14;Research towards AGI continues. First AGI exists
n;nagi-transformative;8;12;Will AGI become transformative?
a;anon-transformative-agi;6;12;Powerful, but not transformative AGI
n;nalignment-theory;8;14;Do we have a practical solution for AGI alignment?
n;nimplement-alignment1;6;14;Will the first AGI lab implement alignment correctly?
n;nprevent-other-agis;4;14;Will the first AGI prevent other AGIs from appearing?
n;nimplement-alignment2;6;16;Will all other AGI labs implement alignment correctly?
i;imultipolar;7;17.5;Multiple conflicting AGIs exist
i;ialigned-agi;4;16;Aligned AGI
n;nwhole-humanity-aligned;4;18;Is AGI aligned with humanity's interests as a whole?
g;gagi-utopia2;4;20;AGI utopia
n;ncontrollers-thoughtful;6;18;Are AGI controllers wise enough to avoid unintended consequences?
n;nagi-protects;8;20;Does AGI protect its users?
e;estupid-xrisk;8;22;Accidental human extinction
n;ncontrollers-good;6;20;Do AGI controllers have good intentions?
e;eauthoritarian-dystopia;6;22;Authoritarian dystopia
i;imisaligned-agi;8;16;(At least one)|Misaligned AGI
n;nfigure-misaligned;8;18;Do we figure out right away that it's misaligned?
n;nturn-off;10;18;Can we easily turn it off?
a;asecond-chance;12;18;We get a second chance at building AGI
n;nharming-us;10;20;Is it harming us?
n;ncan-destroy-it;12;20;Can we destroy it?
n;nbenefit-extinction;12;22;Does it benefit from our extinction?
e;eagi-kills-us;12;24;AGI-initiated human extinction
n;nbenefit-suffering;10;24;Does it benefit from our suffering?
e;emedium-dystopia;10;22;AI dystopia: humans survive, but AI is in control
e;esuffering;8;24;Astronomical suffering
`.trim();

const EDGES_STR = `
-;sstart;ncapabilities-plateau
n;ncapabilities-plateau;npause
y;ncapabilities-plateau;nnew-approaches
y;nnew-approaches;npause
n;nnew-approaches;aai-winter
y;npause;ipause
n;npause;ireach-catastrophic-potential
-;ipause;ncontinue
y;ncontinue;ireach-catastrophic-potential
n;ncontinue;adune
-;ireach-catastrophic-potential;ncatastrophe
y;ncatastrophe;icatastrophy-occurs
-;icatastrophy-occurs;iagi-exists
n;ncatastrophe;iagi-exists
-;iagi-exists;nagi-transformative
y;nagi-transformative;nalignment-theory
n;nagi-transformative;anon-transformative-agi
y;nalignment-theory;nimplement-alignment1
n;nalignment-theory;imisaligned-agi
n;nimplement-alignment1;imisaligned-agi
y;nimplement-alignment1;nprevent-other-agis
n;nprevent-other-agis;nimplement-alignment2
y;nprevent-other-agis;ialigned-agi
n;nimplement-alignment2;imultipolar
-;imultipolar;imisaligned-agi
y;nimplement-alignment2;ialigned-agi
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

