import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

const PAGE_HEIGHT = '327mm';

const A4 = styled.div`
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 4%;
    padding-right: 4%;
    margin: 0;
    @media print {
        width: 210mm;
        max-width: 210mm;
        height: ${PAGE_HEIGHT};
        max-height: ${PAGE_HEIGHT};
    }
`;

const SIZE=400;

const App = () => {
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    // const [game, setGame] = useState(null);
    const [bunkers, setBunkers] = useState([]); 
    // const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        // const getCharacters = async () => {
        //     try {
        //         const response = await fetch('./data/characters.json');
        //         if (!response.ok) {
        //             // would be nice to handle error but meh..
        //             return
        //         }
        //         const json = await response.json();
        //         setCharacters(json);
        //     } catch (err) {
        //         // mehh...
        //     }
        // }
        const getRoles = () => {
            db.collection('users').onSnapshot(function(querySnapshot) {
                const updatedRoles = [];
                querySnapshot.forEach(function(doc) {
                    updatedRoles.push({ id: doc.id, ...doc.data()});
                });
                setRoles(updatedRoles);
            }, (error) => {
                console.log('getRolesError', error)
            });
        }
        // const getGame = () => {
        //     db
        //     .collection("game")
        //     .doc("operacexxx")
        //     .onSnapshot(function(doc) {
        //         setGame(doc.data());
        //     });
        // }
        const getBunkers = () => {
            db.collection("bunkers").onSnapshot(function(querySnapshot) {
                const newBunkers = [];
                querySnapshot.forEach(function(doc) {
                    newBunkers.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setBunkers(newBunkers);
            });
        }
        const getTeams = () => {
            const newTeams = [];
            firebase.firestore().collection("teams").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    newTeams.push({ id: doc.id,...doc.data()});
                });
                setTeams(newTeams);
            });
        };

        getTeams();
        // getGame();
        getBunkers();
        getRoles();   
        // getCharacters();
    }, [])

    return (
    <>
        <A4>
        <h1>QR kody</h1>
    </A4>

    {bunkers.map(b => {
        return (
            <A4>
                {
                    b.name !== 'bily' && (
                        <>
                        <h1>Bunkr "{b.name}"</h1>
                        <h3>Pokud vstupujes do Bunkru, nascanuj QR kod a dej vstoupit. Pokud vstoupis bez nascanovani, bunkr nebude poskytovat ochranu pred readiaci.</h3>
                        <h3>Dokud je bunkr v provozu generuje odpudive pole, ktere pusobi spolehlive proti Divokym. Ti do takoveho bunkru nelezou. Na hrace nema vliv</h3>
                        <h3>Pokud dojde energie, bunkr neposkytuje zadnou ochranu ale je mozne v nem byt.</h3>
                        <h3>V bunkru asi nebudes mit signal, takze udaje ktere uvidis v apce nebudou vzdy aktualni. Doporucujeme
                        se obcas syncnout tak ze vystrcis z bunkru nos.</h3>
                        </>
                    )
                }
                
                {
                    b.name === 'bily' && (
                        <>
                        <h1>Tajna svatyne divokych</h1>
                        <h3>Svatyne divokych funguje stejne jako bunkr s tim rozdilem, ze neemituje odpudive pole proti divokym.</h3>
                        </>
                    )
                }
                <QRCode size={SIZE} value={`bunker:${b.id}`} />
            </A4>
        )
        })}

        <A4>
            <h2>Posledni mistnost ve svatyni</h2>
            <h3>Tady asi taky nebude signal. QR kod by mel jit resit offline. Pokud se ti povede jej vyresit, nezavirej ani nerefreshuj stranku
            a bez se co nejdriv syncnout ven. Sync by mel probehnout na pozadi pote, co chytis internet. Ostatni hraci, kteri jsou zde, by si meli taky syncnout pote, co jiny hrac QR kod vyresi. Sorry za mirnou neprakticnost.</h3>
            <QRCode size={SIZE} value="last-door" />
        </A4>

        <A4>
            <h2>Vyrabovany sklad</h2>
            <QRCode size={SIZE} value="trap" />
        </A4>

        <A4>
            <h2>Automaticky turret</h2>
            <h3>Narazili jste na automaticky turret z pokrocilych zbranovych systemu Beskydskeho odboje. Nechte jej na miste.
            Muzete jej deaktivovat odpojenim baterie napajejici procesor. </h3>
            <h3>Munici ze zasobniku nebrat, ale muzete si vzit loot v podobe pytlicku s munici, pokud se v krabici nachazi.</h3>
        </A4>

        <A4>
            <h2>Automaticke odpalovaci zarizeni</h2>
            <h3>Narazili jste na automaticke odpalovaci zarizeni z pokrocilych zbranovych systemu Beskydskeho odboje. Nechte jej na miste.
            Muzete jej deaktivovat odpojenim baterie napajejici procesor. </h3>
        </A4>

        { new Array(5).fill(1).map(a => {
            return (
                <A4>
                    <h2>Taska s vybavenim</h2>
                    <h3>V teto tasce je jen par veci, ktere vam tu orgove nachystali. </h3>
                    <h3>Je tu nekolik rekvizit znazornujicich mutace. Pokud nejakou mutaci dostanete, vyberte si jednu a zacnete ji 
                    nosit, aby byl vas stav rozpoznatelny.</h3>
                </A4>
            )
        })}
        

        <A4>
        <h1>Teamy</h1>
        {teams.length && roles.length && teams.reduce((data, team) => {
            const teamWithRoles = team;
            teamWithRoles.roles = [];
            roles.forEach(role => {
                if (role.TeamId === team.id) {
                    teamWithRoles.roles.push(role);
                }
            });
            return [ ...data, teamWithRoles ];
        },[]).filter((t) => t.name !== 'bily').map(t => (
            <>
            <div>{t.name}</div>
            <table>
            {

                t.roles.map(r => (
                    <>
                        <tr>
                        <td>{r.name}</td>
                        <td>{r.characterId}</td>
                        <td>{r.tel}</td>
                        </tr>
                    </>
                ))
            }
            </table>

            </>

        ))
        }
        </A4>
        
    </>
    )
}

export default App;