import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';

import {actionCreators as commentActions} from '../redux/modules/comment';

const CommentList = (props) => {
    const dispatch = useDispatch();
    const comment_list = useSelector(state => state.comment.list);
    const {post_id} = props;
    //{console.log(comment_list);}
    React.useEffect(() => {
        if(!comment_list[post_id]){
            dispatch(commentActions.getCommentFB(post_id));
        }
    }, [])
    if(!comment_list[post_id] || !post_id){
        return null;
    }

    return (
        <CommentUl>
            {comment_list[post_id].map(cur => {
                return <CommentItem key={cur.id} {...cur}/>;
            })}
        </CommentUl>
    );
};
const CommentUl = styled.ul`
    margin-bottom: 2rem; 
    padding: 1.5rem; 
    width: 100%;
    border: 1px solid #dddddd;
`
CommentList.defaultProps = {
    post_id: null,
}

export default CommentList;

const CommentItem = (props) => {

    const {user_profile, user_name, user_id, post_id, contents, insert_dt} = props;
    return (
        <CommentLi>
            <div className='comment-user'>
                <img src={"https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748"} alt='사진'/>
                <p className='user-name'>{user_name}</p>
            </div>
            <div className='comment-contents'>
                <p className='comment-txt'>{contents}</p>
                <p className='date'>{insert_dt}</p>
            </div>
        </CommentLi>
    )
}
const CommentLi = styled.li`
    padding: 1rem 0.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    &:last-child {
        border-bottom: 0;
    }
    .comment-user{
        margin-right: 3rem;
        display: flex;
        align-content: center;
        align-items: center;
        img{
            margin-right: 2rem;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            overflow: hidden;
        }
        .user-name{
            width: 5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }
    }
    .comment-contents{
        display: flex;
        align-content: center;
        align-items: center;
        .comment-txt{
            width: 14rem;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }
    }
`

CommentItem.defaultProps = {
    user_profile: "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748",
    user_name: "관리자",
    user_id: "",
    post_id: 1,
    contents: "기본 데이터입니다. 누군가 댓글 작성시,  데이터가 반영됩니다",
    insert_dt: '2021-01-01 19:00:00'
}