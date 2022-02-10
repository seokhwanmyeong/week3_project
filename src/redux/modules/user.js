import {createAction, handleActions} from "redux-actions";
import {
    createUserWithEmailAndPassword, 
    updateProfile, 
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {produce} from "immer";

import {auth} from "../../shared/firebase";
import {setCookie, deleteCookie} from "../../shared/Cookie";
import {history} from "../../index";

// actions
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }))

// initialState
const initialState =  {
    user: null,
    isLogin: false,
};

const user_initial = {
    user_name: 'user_test',
}

//  middleware Actions
const loginFB = (id, pwd) => {
    return function (dispatch, getState){
        console.log(history)
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                return signInWithEmailAndPassword(auth, id, pwd);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });

        signInWithEmailAndPassword(auth, id, pwd)
            .then((user) => {
                console.log(user);
                dispatch(setUser({
                    user_name: user.user.displayName, 
                    id: id, 
                    user_profile:'',
                    uid: user.user.uid,
                }))
                window.location.replace('/');
                //history.push('/home');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                window.alert("아이디와 비밀번호를 확인해주세요")
            });
    }
}

const signupFb = (id, pwd, user_name) => {
    return function (dispatch, getState){
        createUserWithEmailAndPassword(auth, id, pwd)
            .then((user) => {
                console.log(user);
                updateProfile(auth.currentUser, {
                    displayName: user_name,
                }).then(() => {
                    dispatch(setUser({
                        user_name: user_name, 
                        id: id, 
                        user_profile:'',
                        uid: user.user.uid
                    }));
                    window.location.replace('/');
                    //  navi
                }).catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });
    }
}

const loginCheckFB = () => {
    return function (dispatch, getState){
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                dispatch(setUser({
                    user_name: user.displayName,
                    user_profile: "",
                    id: user.email,
                    uid: user.uid,
                }));
                // ...
            } else {
                dispatch(logOut());
            }
          });
    } 
}

const logoutFB= () => {
    return function (dispatch, getState) {
        signOut(auth)
            .then(() => {
                dispatch(logOut());
            }).catch((error) => {
                console.log(error)
            });
    }
}
//reducer
export default handleActions({
    [SET_USER] : (state, action) => produce(state, (draft) => {
        setCookie("is_login", "success")
        draft.user = action.payload.user;
        draft.isLogin = true;
    }),
    [LOG_OUT] : (state, action) => produce(state, (draft) => {
        deleteCookie("is_login")
        draft.user = null;
        draft.isLogin = false;
    }),
    [GET_USER] : (state, action) => produce(state, (draft) => {
        
    }),
}, initialState);


// action creator export
const actionCreator = {
    logOut, getUser, signupFb, loginFB, loginCheckFB, logoutFB
}   

export {actionCreator}