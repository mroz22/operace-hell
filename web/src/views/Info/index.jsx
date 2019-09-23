import React from 'react';
// import styled from 'styled-components';

import background1 from '../../background/dz1.jpg';
import background2 from '../../background/zombie1.jpg';
import background3 from '../../background/stalker1.jpg';
import background4 from '../../background/metro4.jpg';
import background5 from '../../background/stalker4.jpg';
import background6 from '../../background/metro3.jpg';

import { H, P, Section, BigButton } from '../../components';
import Terminal from '../../components/Terminal';

import Users from '../../components/UsersPreliminary';
import Zone from '../../components/Zone';
import Rules from '../../components/Rules';

const styles = {
    intro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    
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
        }}>Operace HELL</div>
    </div>
);

export default (props) => (
    <>
    <Intro />
            <Section>
            <H>Intro</H>
            <P>
            Stojíte na kopci uprostřed menšího háje. Slunce právě zapadá a ty přes pahýly okolních stromů sleduješ, jak zbytky světla ozařují, co kdysi bylo raketovou základnou protivníků. Ty časy jsou už ale dávno pryč a ze základny Ašraf jsou dnes jen ruiny. Když si uvědomíš, že všechno vidíš tak dobře díky všudypřítomnému slabému záření, ucítíš, jak ti kapka studeného potu sklouzne za límec neprůstřelné vesty. Zkontroluješ svůj Geiger. Hlavou ti proletí myšlenka, jestli listí z okolních stromů opadalo, protože zima je na spadnutí, nebo to má co dělat s roztaveným stronciovým jádrem tam dole. Nemůžeš si pomoct, ale nervózně ho zkontroluješ ještě jednou. A později snad ještě tisíckrát.
            </P>
            <P>
            Kusy drátů a betonu pod vašimi botami dávají tušit, že tu kdysi něco stálo. Možná tu měli protivníci připraveno automatické kulometné hnízdo, které chránilo vnější perimetr základny. Dnes už na tom ale nesejde. Protivníci jsou pryč a s nimi i kulomety a celá základna. Nikdo neví, k čemu základna sloužila, ani co se tehdy přesně stalo. Jedno je ale jisté, stronciové reaktory rozhodně nejsou běžnou výbavou raketových základen a v získaném biologickém vzorku se našly fragmenty DNA zcela neznámého původu. Buď, jak buď, naše bombardéry to tu srovnaly se zemí tak důkladně, že to nemohl nikdo přežít a ze základny se stala trvale neobyvatelná Zóna.
            </P>
            </Section>
            <Section>
            <Terminal>
                <kbd>./players-status.sh --filter is:dead </kbd>
                <pre>
                    found:  {'\n'}
                        └── kuratko (poisoned by allies)   {'\n'}
                        └── glosz (killed by TZ)   {'\n'}
                        └── pejchovic (malfunctioned)   {'\n'}
                        (25 more)
                </pre>                
            </Terminal>
            </Section>

            <Section>
            <P>OPERACE LUXOR</P>
            <P>
            Podle vědců nešlo kvůli radioaktivitě, chemickému a biologickému znečištění na nějaký výsadek dlouhé roky ani pomyslet. V minulosti byl učiněn jediný pokus o extrakci technologií ze základny, který však skončil totálním nezdarem. Většina účastníků operace Luxor se ze základny nikdy nevrátila. Všichni přeživší navíc trpěli silnou post-traumatickou poruchou a kolektivními halucinacemi. Aby byli nadále schopni služby, musela jim být selektivně vymazána paměť. 
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
                <P>NOT GREAT NOT TERRIBLE</P>
                <P>
                Nikdo neví proč, ale naše senzory v nedávné době zaznamenaly prudký pokles zamoření Zóny ve všech sledovaných parametrech. Něco se děje a vedení rozhodlo, že budeme u toho. Nedá se říci, že by snad Zóna byla nyní bezpečná, ale bude-li výsadek proveden v řádu hodin, riziko bylo označeno za přijatelné. Desátník Kadaňkov blábolil něco o ekvivalentech rentgenů plic…
                </P>
            
                <P>
                Z dobrovolníků, kteří přežili minulou operaci, byl proto sestaven nový extrakční tým, který má za úkol proniknout do Zóny a vytěžit zde vše, co by mohlo mít nějaký taktický užitek. Zvláštní pozornost je třeba věnovat nejrůznějším technologiím a biologickým anomáliím. Nepřátelská             
                přítomnost se nepředpokládá. V případě nutnosti bude jakýkoliv odpor eliminován. Po splnění mise se přeživší přesunou na shromaždiště, odkud budou převezeni zpět na mateřskou základnu.
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
            <Section>
                <P>
                A tak jsi tady. Chlad i adrenalin se ti vtírají pod kůži a tak trochu křečovitě svíráš svou zbraň a očekáváš své rozkazy. Přejíždíš pohledem z jednoho člena týmu na druhého a vidíš, že jsou na tom úplně stejně.  Přemýšlíš, jestli za pár hodin bude tým stále kompletní… nebo jestli vůbec bude nějaký tým. Sám sebe se ptáš, proč ses vlastně dobrovolně přihlásil, když jsi přísahal, že už se sem nikdy nevrátíš. Jaké že to vzpomínky ti vlastně v zájmu zachování tvého psychického zdraví vymazali?! A nepřidali náhodou taky nějaké? Máš spoustu otázek a žádné odpovědi. V tom se ale ve vysílačce ozve rozkaz a celý tým se dá jako jeden muž do pohybu. Pro otázky už nezbývá místo a zůstávají nezodpovězeny. Možná, že odpovědi tentokrát nalezneš v Zóně.
                </P>
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
                    Hra se odehraje od 22. (pá) do 23. (so) listopadu 2019.<br />
                    Hra začíná v pátek večer mezi 20.00 a 22.0, končí nejpozději v sobotu ve 12.00. <br />
                    
                    Obdobně jako místo, i přesný start hry bude pro hráče individuální a detaily uvidí ve svém profilu.
                </P>
                <H>Princip hry</H>
                <P>
                Operace Hell je koncipována jako týmový survival. Jednotlivé teamy budou zápasit s nástrahami, které jim hra nachystá, ale také soupeřit o omezené zdroje mezi sebou. Neexistuje jediná cesta ke splnění mise – využít lze nejen hrubé síly, ale také lsti a diplomacie. Ve hře se uplatní nejen bojové dovednosti ale i důvtip a schopnost řešit různé hádanky a zapeklité situace. Vlastně se dá Operace Hell přirovnat k mnohahodinové únikové hře.
                </P>
            </Section>
            
            <Background image={background3} />'
            <Section>
                <H>Průzkumníci</H>
            
                <P>
                    Průzkumníci tvoří většinu hráčů. Jsou to právě oni, na kterých AI testuje tuto simulaci. Hrají v teamu
                    a začínají na utajeném místě (dozví se včas před hrou). Svůj team by si měly pečlivě vyladit, jak do složení,
                    tak vybavení. Každý hráč se v registraci rozhodne, za jakou postavu bude hrát a je jeho povinností si obstarat
                    předepsané vybavení.
                </P>

                <P>Povinné vybavení</P>
                <ul>
                    <li>smartphone s baterií, která vydrží po celou dobu hry. Doporučujeme
                    powerbanku. </li>
                    <li>internetove připojení</li>
                </ul>

                <P>Podminky vitezstvi</P>
                <ul>
                    <li>
                    Grandiozni uspech: ziska team, ktery jako prvni objevi tajny kod a s jeho pomoci vstoupi do zamceneho
                    bunkru X
                    </li>
                    <li>
                        Uspech: Prezije do konce hry. <span style={{ color: 'red' }}>Ten nastane kdy? chceme to vubec? mozna klasika ze 
                        pro zbyvajici teamy se urci jeden bunkr a v nem se muze zachranit jen X lidi?</span>
                    </li>
                </ul>


                <H>Divoci</H>
            
                <P>
                    Tato strana je vhodná pro hráče, kteří nemají nebo si nechtějí brát požadavaný smartphone. Takoví 
                    neutrálové, kteří začínají v Zóně, hodně toho o Zóně vědí, takže jsou cenný zdroj informací. Už tam 
                    totiž pěkně dlouho žijou a vůbec jim nevadí radiace (tedy nemusí mít mobil).
                </P>
                <P>
                    Pod jejich táborem se nachází "Svatyně", jejíž útroby velmi pečlivě střeží, sami do její nejposvátěnjší části 
                    prý nikdy nevstupují a kohokoliv, kdo by se o to pokusil rituálně popraví. Kdo ví, jaká tajemství se vevnitř nacházejí?
                </P>
                <P>Podminky vitezstvi</P>
                <ul>
                    <li>Grandiozni uspech: zadny hrac (pruzkumnik nebo divoky) nevstoupi do tajne svatyne.</li>
                    <li>Uspech: Pokud nejaky hrac vstoupi do svatyne, neprezije do konce hry.</li>
                    <li>Uspech: Pokud maji divoci vice kmenu, vyhrava ten, ktery ovlada pristup do svatyne po kumulovane delsi dobu
                    <span style={{color: 'red'}}>(nebo k urcitemu casovemu okamziku??? to je mozna lepsi, protoze v prvnim pripade 
                    jakmile se dostane drzici team na urcitou hodnotu, jiz neni mozne zvratit (za predpokladu fixniho konce))</span> </li>
                </ul>
                <P>
                    Divocí mají postapokalyptické zevzření. Pužívají všemožné hrůzu nahánějící chladné zbraně. Mohou mít i palné zbraně
                    ale pouze semi.
                </P>
                
                <BigButton text="ENTER" onClick={() => props.setIsProfileView(true)} />
            </Section>
            
            <Background image={background4} />
            <Section>
                <Users roles={props.roles} characters={props.characters}/>            
            </Section>

            <Background image={background5} />
            
            <Section>
                <Zone />
            </Section>

            <Background image={background6} />

            <Section>
                <Rules />
            </Section>
    </>
)