import React from 'react';
import styled from 'styled-components';

const Title = props => {
    const {text} = props;

    return (
        <WrapTitle>
            <h3>{text}</h3>
        </WrapTitle>
    );
};
const WrapTitle = styled.div`
    margin-bottom: 2rem;
    width: 100%;
    h3{
        font-size: 3rem;
    }
`

export default Title;