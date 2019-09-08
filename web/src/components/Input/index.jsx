import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const Wrapper = styled.div`
    margin-top: 5px;
    margin-bottom: 15px;
`

const Label = styled.div`

`
const Input = (props) => {
    if (props.type === 'select' || props.type === 'checkbox') {
        return (
            <Wrapper>
                { props.type === 'select' && (
                    <>
                    <Label>{props.label}</Label>
                    <Select
                        value={props.options.find(o => o.name === props.value)}
                        onChange={props.onChange}
                        options={props.options}
                    />
                    </>
                )}
                { props.type === 'checkbox' && (
                    <>
                    <Label>{props.label}</Label>
                    <input type={props.type} checked={props.value} onChange={(event => props.onChange(event))} />
                    </>
                )}
            </Wrapper>
        )
    }

    return (
    <Wrapper>
        <Label>{props.label}</Label>
        <input type={props.type} value={props.value} onChange={(event => props.onChange(event))} />
    </Wrapper>)
    
}

export default Input;