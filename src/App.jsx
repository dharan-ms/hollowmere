import { useEffect } from 'react';
import { IMG } from './images.js';
import { mountHollowmere } from './motion.js';

function Logo() {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" aria-hidden="true">
      <polygon points="13,1 25,23 1,23" fill="#fff" />
      <circle cx="13" cy="15.2" r="3.4" fill="#110A2A" />
      <circle cx="14.4" cy="14.4" r="3" fill="#fff" />
    </svg>
  );
}

function Glow({ cold, left, top, width, delay }) {
  return (
    <div
      className={cold ? 'glow cold' : 'glow'}
      style={{ left, top, width, animationDelay: delay }}
    />
  );
}

function Mist({ left, top, width, height, delay }) {
  return <div className="mist" style={{ left, top, width, height, animationDelay: delay }} />;
}

function Moon({ left, top, width, delay }) {
  return <div className="moonglow" style={{ left, top, width, animationDelay: delay }} />;
}

function Fall({ kind = 'ghost', speed = '1', water, box }) {
  return (
    <canvas
      className="fall"
      data-kind={kind}
      data-speed={speed}
      data-water={water ? '1' : undefined}
      style={box}
    />
  );
}

function Dust({ kind, n, box }) {
  return (
    <canvas
      className="dust"
      data-kind={kind}
      data-n={n}
      data-x={box?.x}
      data-w={box?.w}
      data-y={box?.y}
      data-h={box?.h}
    />
  );
}

function Ghost({ type, x, y, width }) {
  return <div className={`sprite ghost ${type}`} data-x={x} data-y={y} style={{ width }} />;
}

function Bats({ count }) {
  return Array.from({ length: count }, (_, i) => <div className="sprite bat" key={i} />);
}

function Seam({ focus, src, fall }) {
  return (
    <div className="seam" style={{ '--focus': focus }}>
      <div className="band">
        {fall ? <Fall water box={fall} /> : null}
        <img alt="" draggable={false} src={src} />
      </div>
    </div>
  );
}

function Art({ img, batTop, batBot, children }) {
  return (
    <div
      className="art"
      data-bat-top={batTop}
      data-bat-bot={batBot}
      style={{ '--img': `url('${img}')` }}
    >
      <div className="bg" />
      {children}
    </div>
  );
}

const box = (left, top, width, height) => ({ left, top, width, height });

export default function App() {
  useEffect(() => mountHollowmere(), []);

  return (
    <>
      <div className="lamp" aria-hidden="true" />
      <header className="nav">
        <nav className="nav-left" aria-label="Primary">
          <a href="#story">Our Story</a>
          <a href="#rites">The Rites</a>
          <a href="#night">Visitors</a>
        </nav>
        <a className="nav-mid" href="#top" aria-label="Hollowmere">
          <Logo />
        </a>
        <nav className="nav-right" aria-label="Secondary">
          <a href="#finale">Gallery</a>
          <a href="#finale">Journal</a>
          <a className="tickets" href="#finale">Tickets</a>
        </nav>
      </header>

      <div id="scroller">
        <section className="scene hero" id="top" style={{ '--focus': 50 }} aria-label="Moonlit canyon">
          <Art img={IMG.hero} batTop="8" batBot="34">
            <Moon left="50.2%" top="25.6%" width="21%" />
            <Fall box={box('47.4%', '51%', '5.6%', '22%')} />
            <Mist left="50%" top="73%" width="22%" height="9%" delay="-1.4s" />
            <Fall speed="1.15" box={box('44%', '80%', '12.4%', '34%')} />
            <Glow left="4.8%" top="54.4%" width="4.6%" delay="-.4s" />
            <Glow left="18.5%" top="50.6%" width="3.6%" delay="-1.1s" />
            <Glow left="17.5%" top="69.4%" width="3.8%" delay="-1.8s" />
            <Glow left="25.9%" top="38.3%" width="2.6%" delay="-2.3s" />
            <Glow left="31.6%" top="42%" width="2.4%" delay="-.7s" />
            <Glow left="30.4%" top="63%" width="2.4%" delay="-1.5s" />
            <Glow left="80%" top="36.7%" width="3%" delay="-2.6s" />
            <Glow left="85%" top="45.3%" width="3%" delay="-.2s" />
            <Glow left="93.8%" top="53%" width="4.6%" delay="-1.3s" />
            <Glow left="87.8%" top="73%" width="3.8%" delay="-2.1s" />
            <Glow left="74.5%" top="61%" width="2.6%" delay="-.9s" />
            <Glow left="67.2%" top="64.8%" width="2.6%" delay="-1.7s" />
            <Dust kind="wisp" n="70" />
            <Ghost type="g1" x="21" y="30" width="4.2%" />
            <Ghost type="g2" x="78" y="21" width="3.4%" />
            <Ghost type="g4" x="64" y="44" width="2.8%" />
            <Ghost type="g3" x="36" y="46" width="2.4%" />
            <Bats count={4} />
          </Art>
          <div className="hero-copy">
            <h1>
              {'HOLLOWMERE'.split('').map((letter, i) => (
                <span className="ch" key={i}>
                  <span>{letter}</span>
                </span>
              ))}
            </h1>
            <p className="sub">A NIGHT OF LANTERNS</p>
          </div>
        </section>

        <Seam focus={48} src={IMG.seam1} fall={box('44.8%', '2%', '10.4%', '90%')} />

        <section className="scene" id="story" style={{ '--focus': 48 }} aria-label="Crypt laboratory">
          <Art img={IMG.story}>
            <Fall speed=".9" box={box('40.6%', '0', '17.2%', '90%')} />
            <Mist left="49%" top="84%" width="34%" height="14%" delay="-2s" />
            <Glow cold left="20.3%" top="69.8%" width="7%" delay="-.6s" />
            <Glow cold left="72.5%" top="19%" width="5%" delay="-1.4s" />
            <Glow cold left="80.4%" top="18.1%" width="4.4%" delay="-2.2s" />
            <Glow cold left="76%" top="41.6%" width="5.6%" delay="-.3s" />
            <Glow cold left="85%" top="43.3%" width="4%" delay="-1.8s" />
            <Glow cold left="70.5%" top="68.5%" width="4.4%" delay="-2.7s" />
            <Glow cold left="77.3%" top="63.7%" width="4.4%" delay="-1.1s" />
            <Glow cold left="85.3%" top="66.3%" width="4%" delay="-.8s" />
            <Glow left="7.6%" top="85%" width="4.4%" delay="-1.6s" />
            <Glow left="13.2%" top="87%" width="3.2%" delay="-.5s" />
            <Glow left="92.2%" top="84%" width="3.6%" delay="-2.4s" />
            <Dust kind="mote" n="50" />
            <Ghost type="g4" x="30" y="22" width="2.6%" />
          </Art>
          <div className="copy">
            <h2>Our Story</h2>
            <div className="rule" />
            <p>Every October the falls of Hollowmere run pale. For one night the canyon lights its lanterns, the old houses open their doors, and the ghosts come home to visit.</p>
            <p>We have kept the night for two hundred years: a walk through the crypts, the mill and the cauldron halls, ending at the lake where the lanterns are set free.</p>
            <div className="ln"><span><a className="btn" href="#story">Read the legend</a></span></div>
          </div>
        </section>

        <Seam focus={40} src={IMG.seam2} fall={box('21.4%', '22%', '10.6%', '74%')} />

        <section className="scene" id="rites" style={{ '--focus': 40 }} aria-label="Mill wheel chamber">
          <Art img={IMG.rites}>
            <Fall speed="1.05" box={box('19.5%', '0', '18%', '38%')} />
            <Mist left="31%" top="33%" width="22%" height="10%" delay="-.8s" />
            <Glow left="12%" top="34%" width="4.2%" delay="-.3s" />
            <Glow left="37.5%" top="47.7%" width="4.2%" delay="-1.4s" />
            <Glow left="32.3%" top="52.6%" width="4.2%" delay="-2.2s" />
            <Glow left="11.7%" top="62.3%" width="4.2%" delay="-.9s" />
            <Glow left="39%" top="78.2%" width="4.2%" delay="-1.9s" />
            <Glow cold left="64.5%" top="70.3%" width="9%" delay="-1.2s" />
            <Glow cold left="88.5%" top="70.7%" width="9%" delay="-2.5s" />
            <Glow left="61.4%" top="75%" width="2.4%" delay="-.6s" />
            <Glow left="72.6%" top="75.4%" width="2.4%" delay="-1.7s" />
            <Glow left="91.5%" top="75.4%" width="2.4%" delay="-2.3s" />
            <Dust kind="spray" n="60" box={{ x: '20', w: '20', y: '30', h: '18' }} />
          </Art>
          <div className="copy">
            <h2>The Rites</h2>
            <div className="rule" />
            <h3>The Lantern Walk.</h3>
            <p>At dusk the procession leaves the castle gate and follows the ghost-light falls down into the canyon. Bring a lantern, or borrow one of ours at the gate.</p>
            <p>Children lead, the old walk last, and nobody looks back until the bells stop.</p>
            <h3>The Turning Wheel.</h3>
            <p>Below the falls the old mill turns all night. Write a wish on a paper lantern, pin it to a spoke, and let the wheel carry it round to midnight.</p>
          </div>
        </section>

        <Seam focus={66} src={IMG.seam3} fall={box('60.8%', '46%', '13.6%', '50%')} />

        <section className="scene" id="night" style={{ '--focus': 66 }} aria-label="Cauldron foundry">
          <Art img={IMG.night}>
            <Fall box={box('67.4%', '0', '11.8%', '37%')} />
            <Fall kind="lava" speed=".55" box={box('62.3%', '66.5%', '1.8%', '25%')} />
            <Fall kind="lava" speed=".6" box={box('69.4%', '66.5%', '1.8%', '25%')} />
            <Fall kind="lava" speed=".5" box={box('76.5%', '66.5%', '1.8%', '25%')} />
            <Glow left="70%" top="93%" width="26%" delay="-1.1s" />
            <Glow left="16.8%" top="78.2%" width="6%" delay="-.4s" />
            <Glow left="27.8%" top="85.3%" width="4%" delay="-1.8s" />
            <Glow left="18%" top="66.3%" width="8%" delay="-2.5s" />
            <Glow cold left="73%" top="33%" width="14%" delay="-.7s" />
            <Dust kind="bubble" n="22" box={{ x: '60', w: '24', y: '8', h: '28' }} />
          </Art>
          <div className="copy">
            <h2>Plan Your Night</h2>
            <div className="rule" />
            <h3>Gates at Six.</h3>
            <p>The gates open at 18:00 on 31 October. The walk takes about ninety minutes, and the cauldron halls stay open until three, serving spiced cider, soul cakes and hot pumpkin broth.</p>
            <h3>Midnight at the Cauldron.</h3>
            <p>At the twelfth bell the great cauldron is lit and every lantern in Hollowmere is carried down to the lake. Stay for it.</p>
          </div>
        </section>

        <Seam focus={45} src={IMG.seam4} />

        <section className="scene" id="finale" style={{ '--focus': 45 }} aria-label="Lantern lake">
          <Art img={IMG.finale} batTop="24" batBot="40">
            <Moon left="39.1%" top="56.6%" width="19%" delay="-1.5s" />
            <Dust kind="shimmer" n="90" box={{ x: '34', w: '10', y: '69', h: '22' }} />
            <Glow left="29.9%" top="76.7%" width="3.4%" delay="-.2s" />
            <Glow left="32.9%" top="72.7%" width="2.4%" delay="-1.1s" />
            <Glow left="45.9%" top="72.7%" width="2.4%" delay="-1.9s" />
            <Glow left="48.3%" top="77.4%" width="3.6%" delay="-.6s" />
            <Glow left="55.4%" top="81.8%" width="4%" delay="-2.2s" />
            <Glow left="58.1%" top="75.6%" width="3.2%" delay="-1.4s" />
            <Glow left="53.9%" top="72.2%" width="2.2%" delay="-.8s" />
            <Glow left="62.5%" top="72.5%" width="2.2%" delay="-2.6s" />
            <Glow left="69.9%" top="80.9%" width="4%" delay="-1.6s" />
            <Glow left="74.9%" top="75.9%" width="3.2%" delay="-.4s" />
            <Glow left="73%" top="72.3%" width="2.2%" delay="-2.1s" />
            <Glow left="79.1%" top="72.5%" width="2.2%" delay="-1.3s" />
            <Glow left="24.8%" top="72.1%" width="2.2%" delay="-.9s" />
            <Glow left="7.8%" top="65.4%" width="5%" delay="-1.7s" />
            <Glow left="89.8%" top="76.9%" width="5%" delay="-2.4s" />
            <Ghost type="g2" x="66" y="26" width="3%" />
            <Ghost type="g1" x="27" y="38" width="2.6%" />
            <Bats count={3} />
          </Art>
          <div className="copy">
            <h2>See you at midnight.</h2>
            <div className="rule" />
            <div className="ln">
              <span className="btns">
                <a className="btn" href="#finale">Get tickets</a>
                <a className="btn ghost" href="#night">Plan your visit</a>
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
