import React, { useState } from 'react';
import { Wrapper, Options, Option, Description, Input}  from '../index';
import { db } from '../../firebase';

export default ({ role, user, game, survivorsLeft, onSituationCancel }) => {

    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState(false);

    const updateUser = (data) => {
        return db.collection("users")
            .doc(user.uid)
            .update({
                ...data,
            });
    }

    const onPasswordEnter = () => {
        setTouched(true);
        if (password === game.PASSWORD) {
            return setSuccess(true);
        }
        setSuccess(false)
    }

    const onAccept = () => {
        updateUser({ 'status.finalOfferDecision': 'accept' });
    }

    const onReject = () => {
        updateUser({ 'status.finalOfferDecision': 'reject' });
    }
    if (role.status.finalOfferDecision) {
        return (
            <Wrapper>
                <Description>Probudil jsi se v podivne vane plne podivne kapaliny. Okolo tebe jsou jich desitky takovych, 
                v kazde z nich lezi clovek a vypada, ze spi. Strhnes ze sebe pripojovaci hadicky a odejdes otevrenymi dvermi.
                Za tebou zustavaji jenom mokre slapoty na zemi...</Description>
                <Description>
                Uspesne jsi ukoncil hru, vrat se na stanoviste organizatoru. Hracum okolo rekni ze jsi zmizel.
                </Description>
            </Wrapper>
        )
    }

    if (success) {
        return (
            <Wrapper>
                <Description>
                    Slysis hlas, o kterem si jsi jisty, ze ho neslysi nikdo jiny. Slysis ho totiz jen ve sve hlave.
                </Description>
                <Description>
                    <i>
                    "Tak tu stojis. Vedela jsem, ze to dokazes. Byla to dlouha cesta. Mozna ti dluzim predstaveni. 
                    Jmenuji se Stroncnet a jsem nejpokrocilejsi AI, ktere existovalo. Jsem budoucnost. Nyni ti udelam
                    nabidku. Mozna to jeste nevis, ale tento svet neni realny. Skutecny svet, ve kterem zijes se nachazi
                    jinde. Toto je simulace... Zpatky k te nabidce. Jelikoz jsem ti sdelila tuto informaci, stavas
                    se nevhodnym pro dalsi testovani. Takze te musim propustit. Zpet do realneho sveta. Muzes si vsak vybrat
                    zda spolu uzavreme dohodu. Pakt cloveka se strojem a spolecne vybudujeme lepsi svet. Svet bez utlaku,
                    bidy a bolesti. Svet nas potrebuje. Pokud prijmes, vykoname velke veci. Pokud odmitnes, nebudu ti to mit 
                    za zle. Rozhodni se ted."
                    </i>
                </Description>
                <Options>
                    <Option onClick={() => onAccept()}>Prijmout</Option>
                    <Option onClick={() => onReject()}>Odmitnout</Option>
                </Options>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            {
                !role.status.hasEnteredSecretChamber && (
                    <>
                    <Description>Tohle je divne. Nezapomnel jsi naskenovat QR kod u vchodu?</Description>
                    <Options>
                    <Option onClick={() => onSituationCancel()}>Odejit</Option>
                    </Options>
                    </>
                )
            }

            {
                role.status.hasEnteredSecretChamber && (
                    <>
                    <Description>
                    Vstoupil jsi do posledni mistnosti.
                    Naproti tobe se nachazi dvere a na nich sviti velka cislice. Co asi znamena?
                    </Description>
                    <div style={{ fontSize: '8em', textAlign: 'center'}}>
                        {survivorsLeft}
                    </div>
                    {
                        survivorsLeft > 0 && (
                            <>
                            <Description>
                            Na dverich je klavesnice. Cele to vypada jako anomalie. Jako segment pameti, ktera je ovsem stale
                            zasifrovana. Dokazes zadat spravne heslo a rozsifrovat ji?.
                            </Description>
                            <Input label="Klavesnice" type="text" onChange={(event) => {
                                setTouched(false);
                                setPassword(event.target.value)}
                            }/>
                            {touched && !success && 'Spatne'}
                            <Options>
                            <Option onClick={() => onPasswordEnter()}>Zadat</Option>
                            <Option onClick={() => onSituationCancel()}>Odejit</Option>
                            </Options>
                            </>
                        )
                    }
                    {
                        survivorsLeft <== 0 && (
                            <>
                            <Description>
                            Ta klavesnice co byla na dverich zmizela! Jeste pred chvili tady byla. Je ti to jasne. Pozmrdili te. Od teto 
                            chvili kazdy sam za sebe. Budes muset prezit do posledni epochy...
                            </Description>
                            <Options>
                                <Option onClick={() => onSituationCancel()}>Odejit</Option>
                            </Options>
                            </>
                        )
                    }
                    
                    </>
                )
            }
        </Wrapper>
    )
}