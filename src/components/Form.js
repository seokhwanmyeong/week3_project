import React from 'react';
import styled from 'styled-components';

/* Elements */
import {Btn} from '../elements/element';

const Form = props => {
    return (
        <StyleForm>
            <Btn eventType={"click"} event={null} text={"회원가입"}/>
        </StyleForm>
    );
};
const StyleForm = styled.form`

`

export default Form;