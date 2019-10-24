import styled from 'styled-components';

const green = "#20C20E" 
const Wrapper = styled.div`
    background-color: black;
    color: ${green};
    height: 100%;
    padding: 4%;
`

const Description = styled.div`
    margin-bottom: 10px;
`;

const Options = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`

const Option = styled.div`
    widht: 100%;
    border: green dashed 1px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
`

const Heading = styled.div`
    width: 100%;
    border: green dashed 1px;
    text-align: center;
`

export {
    Wrapper,
    Option,
    Options,
    Description,
    Heading,
};