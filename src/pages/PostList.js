import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* Source */
import {actionCreator as postActions} from '../redux/modules/post'
import InfinityScroll from '../shared/InfinityScroll';

/* Components */
import {Post} from '../components/component';

/* Elements */
import {Spinner} from '../elements/element'

const PostList = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    const isLoading = useSelector((state) => state.post.isLoading);
    const paging = useSelector((state) => state.post.paging);

    React.useEffect(() => {
        if(post_list.length < 2){
            dispatch(postActions.getPostFB());
        }
    }, [])

    return (
        <React.Fragment>
            {/* isLoading이 true && paging.next이 없을경우(scroll이벤트와 중복을 피하기 위해) */}
            {(isLoading && !paging.next) && (<Spinner type={'page'} is_dim={true}/>)}
            <InfinityScroll 
                callNext={() => {
                    dispatch(postActions.getPostFB(paging.next));
                }}
                isNext={paging.next? true : false}
                loading={isLoading}
            >
                <PostUl>
                    {post_list.map((cur, idx) => {
                        if(user_info && cur.user_info.user_id === user_info.uid){
                            return (
                                <Post _onClick={() => {navigate(`/detail/${cur.id}`)}} key={cur.id} layer={cur.layer} {...cur} my_post/>
                            )
                        }
                        return (
                            <Post _onClick={() => {navigate(`/detail/${cur.id}`)}} key={cur.id} layer={cur.layer} {...cur}/>
                        )
                    })}
                </PostUl>
            </InfinityScroll>
        </React.Fragment>
    );
};
const PostUl = styled.div`
    margin: 0 auto;
    width: 40rem;
    display: flex;
    align-items: center;
    flex-direction: column;
`

export default PostList;