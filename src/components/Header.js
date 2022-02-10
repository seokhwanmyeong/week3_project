import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';

/* Source */
import {actionCreator} from '../redux/modules/user';
import {apiKey} from '../shared/firebase';
import Permit from '../shared/Permit';

/* Components */
import {NotiBadge} from '../components/component'

/* Elements */
import {Btn} from '../elements/element';

/* img, icons */
import {HouseSvg} from '../icons/icons';

const Header = (props) => {
    const dispatch = useDispatch();
    const my_id = useSelector(state => state?.user?.user?.uid)
    const user_name = useSelector(state => state?.user?.user?.user_name)
    const isLogin = useSelector((state) => state.user.isLogin);
    const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const isSession = sessionStorage.getItem(_session_key) ? true : false;
    
    return (
        <React.Fragment>
            <StyleHeader>
                <div className='header-contents'>
                    <div className='header-content'>
                        <Link className='home' to='/'>
                            <HouseSvg/>
                        </Link>
                    </div>
                    <div className='header-content'>
                        <div className='header-content-group'>
                            {(() => {
                                if(isSession && isLogin){
                                    return  (
                                        <Permit>
                                            <React.Fragment>
                                                <div className='header-current-user'>
                                                    <img src="https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748" className='my-profile-img' alt="임시"/>
                                                    <span className='my-login-id'>{user_name}님</span>
                                                </div>
                                                {/* <Btn text={"내 정보"} /> */}
                                                <NotiBadge/>
                                                <Btn _click={() => dispatch(actionCreator.logoutFB())} text={"LOGOUT"} />
                                            </React.Fragment>
                                        </Permit>
                                    )
                                }
                                return (
                                    <React.Fragment>
                                        <Link to='/login' className='type-btn'>
                                            Login
                                        </Link>
                                        <Link to='/signup' className='type-btn'>
                                            Sign Up
                                        </Link>
                                    </React.Fragment>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            </StyleHeader>
        </React.Fragment>
    )
};

const StyleHeader = styled.header`
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    padding: 1.5rem 0;    
    width: 100vw;
    border-bottom: 1px solid #dddddd;
    background-color: #ffffff; 
    .header-contents{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        width: 80vw;
        max-width: 80rem; 
        .header-content{
            a + a{
                margin-left: 2rem;
            }
            .home{
                svg{
                    width: 2rem;
                    height: 2rem;
                    path{
                        &:hover{
                            fill: #666666
                        }
                    }
                }
            }
            .header-content-group{
                display: flex;
                justify-content: flex-end;
                .header-current-user{
                    margin-right: 2rem;
                    display: flex;
                    align-items: center;
                    img{
                        margin-right: 1rem;
                    }
                }
                .my-profile-img{
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                }
            }
        }
    }
`

export default Header;