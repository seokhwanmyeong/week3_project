import React from 'react';
import styled from 'styled-components';
import {useDispatch, userSelector} from  'react-redux'

import {actionCreators as commentActions} from '../redux/modules/comment';

import {Btn} from '../elements/element'

import { db } from '../shared/firebase';
import {
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    increment,
    getDoc
  } from 'firebase/firestore';



const CommentWrite = (props) => {
    const {post_id} = props
    const dispatch = useDispatch();
    const [comment_txt, setCommentTxt] = React.useState("");

    const onChange = (e) => {
        setCommentTxt(e.target.value);
    }

    const write = () => {
        //console.log(comment_txt);
        if(comment_txt === "") {
            window.alert("댓글을 입력해주세요!");
            return;
        }
        setCommentTxt("");
        dispatch(commentActions.addCommentFB(post_id, comment_txt))
    }
    // const postDB = doc(db, "post", post_id);
    // const resultOut = getDoc(postDB).then((doc) => {
    //     console.log("포스트 디비다 이자식아 : ", doc.data().user_id)
    // })
    return (
        <Comment>
            <input type="text" onChange={onChange} onKeyPress={(e) => {if(e.key === "Enter") write(e)}} placeholder='댓글 입력칸' value={comment_txt}/>
            <Btn _click={write} text={"작성"}/>
        </Comment>
    );
};
const Comment = styled.div`
    display: flex;
    width: 100%;
    input{
        flex: 1;
        width: 100%;
        padding: 0 1rem;
        border-right: 0;
    }
`

export default CommentWrite;