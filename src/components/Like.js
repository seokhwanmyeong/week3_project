import React from 'react';
import styled, {css} from 'styled-components';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

/* Source */
import {actionCreators as likeActions} from '../redux/modules/like';

/* Elements */
import {Btn} from '../elements/element'

/* IMG, ICONS */
import {HeartSvg} from '../icons/icons'

const Like = (props) => {
    const {post_id} = props
    const dispatch = useDispatch();
    const user_info = useSelector((state) => state.user.user);
    const postDB = useSelector(state => state.post.list)
    const post_idx = postDB.findIndex(arr => arr.id === post_id)
    const target_post = postDB[post_idx];
    //console.log(target_post)
    const [is_check, setCheck] = React.useState(false)

    const check_list = () => {
        if(!is_check){
            dispatch(likeActions.checkLikeFB(post_id, user_info.uid))
            return setCheck(true);
        }else{
            dispatch(likeActions.uncheckLikeFB(post_id, user_info.uid))
            return setCheck(false);
        }
    }
    React.useEffect(() => {
        if(target_post.like.check_id.indexOf(user_info?.uid) !== -1){
            setCheck(true);
        }else{
            setCheck(false);
        }
    }, [])
    return (
        <LikeBox is_check={is_check}>
            <button type='button' onClick={check_list}><HeartSvg/></button>
            <span>좋아요</span>
            <span>{target_post.like.list_cnt}개</span>
        </LikeBox>
    );
};

const LikeBox = styled.div`
    button{
        margin-right: 0.5rem;
        svg{
            width: 1.5rem;
            height: 1.5rem;
        }
        ${(props) => (props.is_check === true) ? css`
            svg{
                width: 1.5rem;
                height: 1.5rem;
                path{
                    fill: #ff0844;
                }
            }
        ` : ""}
    }
    span+span{
        margin-left: 0.5rem; 
    }

`

export default Like;