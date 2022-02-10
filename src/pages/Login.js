import React from 'react';
import {useDispatch} from "react-redux"

/* source */
import {setCookie} from '../shared/Cookie';
import {actionCreator} from '../redux/modules/user';

/* componenet */
import {Title} from '../components/component';

/* elements */
import {Btn} from '../elements/element';
import styled from 'styled-components';

const Login = props => {
    const dispatch =  useDispatch();
    const [id, setId] = React.useState('');
    const [pwd, setPwd] = React.useState('')
    
    const changeId = (e) => {
        setId(e.target.value);
    }

    const changePwd = (e) => {
        setPwd(e.target.value);
    }

    const login = () => {
        if(id === "" || pwd === ""){
            window.alert("아이디/비밀번호를 확인해주세요")
            return
        }
        console.log("로그인진행중")
        dispatch(actionCreator.loginFB(id, pwd));
    }

    return (
        <React.Fragment>
            <Title text={"LOGIN"}/>
            <Form>
                <label>
                    <input value={id} onChange={changeId} type="text" placeholder="아이디를 입력하세요."/>
                </label>
                <label>
                    <input value={pwd} onChange={changePwd} type="password" placeholder="비밀번호를 입력하세요."/>
                </label>
                <Btn _click={login} text={"로그인"}/>
            </Form>
        </React.Fragment>
    );
};
const Form = styled.form`
    margin: 0 auto;
    width: 20rem;
    display: flex;
    flex-direction: column;
    label{
        margin-bottom: 3rem;
        input{
            padding: 0 1rem;
            width: 100%;
            height: 2rem;
            line-height: 2rem;
        } 
    } 
`


export default Login;