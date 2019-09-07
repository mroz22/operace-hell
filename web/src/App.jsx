import React, { useState } from 'react';
import * as firebase from 'firebase';

import background1 from './background/dz1.jpg';
import background2 from './background/zombie1.jpg';
import background3 from './background/stalker1.jpg';
import background4 from './background/metro4.jpg';
import background5 from './background/stalker4.jpg';
import background6 from './background/metro3.jpg';

import { H, P } from './components';
import Terminal from './components/Terminal';
import Preloader from './components/Preloader';

import Users from './views/Users';
import Signup from './views/Signup';
import Profile from './views/Profile';
import Zone from './views/Zone';
import Rules from './views/Rules';

const styles = {
    app: {
        height: '100%'
    },
    intro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }
    section: {
        backgroundColor: 'white',
        // width: '90vw',
        padding: '30px 15% 30px 15%';
        // height: '190vh';
        opacity: 0.85,
        borderRadius: '5px',
    }
    image: {
        parallax: {
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
        background: {
            width: '100%',
            minHeight: '55%',
        }

    }
}

const Background = ({ image }) => (
    <div style={{
        ...styles.image.background,
        ...styles.image.parallax,
        backgroundImage: `url(${image})`
    }}></div>
) 

const Intro = (props) => (
    <div style={{...styles.intro, ...styles.image.background, backgroundImage: `url(${background1})`}}>
        <div style={{ 
            opacity: 0.75,
            backgroundColor: 'black',
            padding: '30px',
            fontSize: '4em',
            color: 'white',
        }}>Operace LAIR JE SUCHTA</div>
    </div>
);

const Section = (props) => (
    <div style={styles.section}>
        { props.children }
    </div>
);

const App = () => {

    const [ user, setUser ] = useState(null);

    firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
    });

    return (
        <Preloader>
        <div style={styles.app}>  
            <Intro />
            <Section>
            <H>Intro</H>
            <P>
                Operace Hell navazuje na operaci Luxor. Na této akci jednotky ChLDR obsadily základnu Beskydského odboje
                a měly za úkol ji udržet. Po zajištění základny se však "vzbudil" autonomní obranný systém, který se pokoušel
                obránce zlikvidovat. Například tím, že postupně odemykal zámky na skladech TZ (techniční zaměstnanci, lidově
                technozombie) a vypouštěl je do prostoru.
            </P>
            </Section>
            <Section>
            <Terminal>
                <kbd>./players-status.sh --filter is:dead </kbd>
                <pre>
                    found:  {'\n'}
                        └── kuratko (poisoned by allies)   {'\n'}
                        └── glosz (killed by TZ)   {'\n'}
                        (25 more)
                </pre>                
            </Terminal>
            </Section>

            <Section>
            <P>
                Hráči museli nejen bojovat proti TZ ale také prozkoumávat základnu a odhalovat její tajemství (luštit šifry).
                V průběhu hry mohli někteří z hráčů z nachystaných indicií zjistit (nezjistili), že to vše okolo je jen iluze.
                Ve skutečnosti to byla počítačová simulace, do níž byly nahrány skeny mozků skutečných bytostí, a jejichž úsilí
                (luštění šifer) bylo využíváno k těžbě pokročilých technologií (takové strojové učení).
            </P>
            </Section>

            <Section>
            <Terminal>
                <kbd>./players-status.sh --filter is:alive </kbd>
                <pre>
                    found:  {'\n'}
                        └── major_jasin@sector-8 {'\n'}
                        └── vykasin@sector-8 {'\n'}
                        └── vykasin@central-bunker {'\n'}
                        └── vykasin@central-bunker {'\n'}
                        └── vykasin@central-bunker {'\n'}
                        └── vykasin@central-bunker {'\n'}
                </pre>
                <kbd>./set-difficulty.sh --level MAX </kbd>
                <pre>simulation difficulty set to max level</pre>
            </Terminal>
            </Section>
            <Section>
                
                <P>
                    Na samém konci AI vyhodnotilo, že již nemá smysl simulaci dále spouštět, jelikož situace obránců byla 
                    beznadějná. Simulaci ukončilo a skeny takto přeživších (rozuměj vyselektovaných) hráčů nahrálo do vyšší
                    úrovně simulace s názvem HELL. Tato simulace je mnohem efektivnější, co se těžby technologií týče, avšak 
                    má jednu nevýhodu. Sken, který v ní zahyne, je nadobro ztracena i v reálném světě, jeho tělo 
                    zemře. Hráči to vědí, a tak,
                    budou-li chtít někdy nebezpečné AI porazit, musí alespoň někdo přežít, aby nevyhysla naděje, že se alespoň
                    podaří podat zprávu.
                </P>
            
                <P>
                    Podaří se hráčům přežít i tuto simulaci? Podaří se jim přijít na to, jak ze simulace uniknout?
                </P>
            </Section>
            <Section>
                <Terminal>
                    <pre>
                        Surviving change zero. Resource saving mode on. Terminating routine Luxor {'\n'}
                    </pre>
                    <kbd>./load-hell.sh -p jasin,vykasin</kbd>
                    <pre>
                        Loading routine Hell
                    </pre>
                </Terminal>
            </Section>

            <Background image={background2} />
            <Section>
                <H>Místo</H>
                <P>
                    Raketová základna Leskovec Březová. Start do hry je však individuální, nebude žádný hromadný sraz před 
                    hrou. Detaily uvidí hráči po registrace ve svém profilu.
                </P>
                <H>Datum</H>
                <P>
                    Víkend 1. - 3. listopadu 2019. <br />
                    Hra začíná v pátek večer mezi 20.00 a 22.0, končí nejpozději v sobotu ve 12.00. <br />
                    
                    Obdobně jako místo, i přesný start hry bude pro hráče individuální a detaily uvidí ve svém profilu.
                </P>
                <H>Princip hry</H>
                <P>
                    Operace Hell je koncipována jako team survival. Jednotlivé teamy budou zápasit s nástrahami, které 
                    jim nachystá hra, ale také budou muset soupeřit o omezené zdroje mezi sebou, ať už pomocí hrubé síly,
                    lsti nebo diplomacie. Ve hře se uplatní nejen bojové ale dovednosti ale i důvtip a schopnost řešit 
                    šifry a zapeklité situace. Jde vlastně o takový akční celodenní escape room.
                </P>
                <H>Podmínky vítězství</H>
                <P>
                    Cílem AI je vytřídit ze vstupů kvalitní výstup. Tzn z vstupních dat (teamů) vytřídit jeden team, který
                    nemusí být nutně ve stejném složení, v jakém začínal. Tento team se na místě, které ve hře snadno zjistí, 
                    bude moci v určitém časovém okně dostat ze simulace.
                </P>
            </Section>
            
            <Background image={background3} />'
            <Section>
                <H>Průzkumníci</H>
            
                <P>
                    Průzkumníci tvoří většinu hráčů. Jsou to právě oni, na kterých AI testuje tuto simulaci. Hrají v teamu
                    a začínají na utajeném místě (dozví se včas před hrou). Svůj team by si měly pečlivě vyladit, jak do složení,
                    tak vybavení. Každý hráč se v registraci rozhodne, za jaké vybavení utratí přidělené body 
                    (zbraně, střelivo, geigerův počítač, atombordel...).
                    Povinné vybavení: smartphone s internetovým připojením a baterií, která vydrží po celou dobu hry. Doporučujeme
                    powerbanku. 
                </P>

                <H>Deus ex MAŠINA /nebo/ Agenti Smith</H>
            
                <P>
                    // TODO:: 
                    Tato strana je vhodná pro hráče, kteří nemají nebo si nechtějí brát požadavaný smartphone. Takoví 
                    neutrálové, kteří začínají v Zóně, hodně toho o Zóně vědí, takže jsou cenný zdroj informací. Už tam 
                    totiž pěkně dlouho žijou a vůbec jim nevadí radiace (tedy nemusí mít mobil).

                    Ale nemůžu se rozhodnout, jestli to mají být Agenti na styl Matrixu, nebo Deus ex Machina na style 
                    knížky zakuti v oceli. Ti první jsou jasní. Druzí byli takoví poloprimitivní lidé, které uctívali 
                    umělou inteligenci a pomáhali jí získávat zdroje a ona je za to odměňovala.
                </P>

                {
                    user ? <Profile user={user}/> : <Signup /> 
                }
            </Section>
            
            <Background image={background4} />
            <Section>
                <Users />            
            </Section>

            <Background image={background5} />
            
            <Section>
                <Zone />
            </Section>

            <Background image={background6} />

            <Section>
                <Rules />
            </Section>
        </div>
        </Preloader>
    )
}

export default App;