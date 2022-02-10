import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

/* source */
import {actionCreator} from  '../redux/modules/user'

/* componenet */
import {Title} from '../components/component';

/* elements */
import {Btn} from '../elements/element';

const Signup = props => {
    const dispatch = useDispatch();

    const [id, setId] = React.useState("");
    const [user_name, setUserName] = React.useState("");
    const [pwd, setPwd] = React.useState("");
    const [pwd_check, setPwdCheck] = React.useState("");

    const signup = () => {
        dispatch(actionCreator.signupFb(id, pwd, user_name));
    }
    return (
        <React.Fragment>
            <Title text={"회원가입"}/>
            <Form>
                <label>
                    <input type="text" onChange={(e) => {setId(e.target.value)}} placeholder='아이디를 입력해주세요'/>
                </label>
                <label>
                    <input type="text" onChange={(e) => {setUserName(e.target.value)}} placeholder='닉네임을 입력해주세요'/>
                </label>
                <label>
                    <input type="password" onChange={(e) => {setPwd(e.target.value)}} placeholder='비밀번호를 입력해주세요'/>
                </label>
                <label>
                    <input type="password" onChange={(e) => {setPwdCheck(e.target.value)}} placeholder='비밀번호를 재입력해주세요'/>
                </label>
                <Btn _click={() => signup()} text={"회원가입하기"}/>
            </Form>
        </React.Fragment>
    );
};
const Form = styled.form`
    margin: 0 auto;
    width: 25rem;
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

export default Signup;