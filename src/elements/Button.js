import React from 'react';
import styled, {css} from 'styled-components';

const Btn = props => {
    const {eventType, event, text, isFixed, _class, _click, icons} = props;
    
    if(_click){
        return (
            <Button type='button' onClick={_click} isFixed={isFixed} className={`${_class?_class:""}`}>
                <span>{text}</span>
            </Button>
        );
    }else{
        return (
            <Button type='button' isFixed={isFixed} className={`${_class?_class:""}`}>
                {text}
            </Button>
        );
    }
};
const Button = styled.button`
    padding: 0.6rem 1.5rem;
    border: 1px solid #dddddd;
    &:hover {
        border: 1px solid #222222;
        background-color: #222222;
        color: #ffffff;
    }
    ${(props) => (props.isIcon ? css`
        padding: 0;
        border: 0;
    ` : "")}
    ${(props) => (props.isFixed ? css`
        padding: 0;
        border: 0;
        position: fixed;
        bottom: 0rem;
        right: 0rem;
        width: 8rem;
        height: 8rem;
        border-top: 4rem solid transparent;
        border-right: 8rem solid #f43b47;
        color: #ffffff;
        span{
            position: fixed;
            right: 2rem;
            bottom: 2rem;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all ease 1s 0s;
        }
        &:hover {
            border-top: 4rem solid transparent;
            border-right: 8rem solid #453a94;
            border-left: 0;
            border-bottom: 0;
            background-color: transparent;
            transition: all ease 1s 0s;
        }
    ` : "")}
`

export default Btn;