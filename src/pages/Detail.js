import React from 'react';
import styled from 'styled-components';
import {Post, CommentList, CommentWrite} from '../components/component';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
// import {collection, query, where, getDoc, doc} from 'firebase/firestore';
// import {db} from '../shared/firebase';

import {actionCreator as postActions} from '../redux/modules/post';

import Permit from '../shared/Permit';

const Detail = (props) => {
    const dispatch = useDispatch();
    const params = useParams();
    const url_id = params.id;
    //console.log(url_id);

    const user_info = useSelector((state) => state.user.user);
    const post_list = useSelector(store => store.post.list);
    const post_idx = post_list.findIndex(cur => cur.id === url_id);
    const post = post_list[post_idx];
    // const [post, setPost] = React.useState(post_data? post_data: null);
    // console.log(post)
    // console.log(user_info)
    React.useEffect(() => {
        //const postRef = collection(db, "post");
        if(post){
            return;
        }
        dispatch(postActions.getOnePostFB(url_id));
        // const postRef = doc(db, "post", url_id)
        // const postDB = getDoc(postRef).then((doc) => {
        //     console.log(doc);
        //     console.log(doc.data());

        //     let _post = doc.data()
        //     let post = Object.keys(_post).reduce((acc, cur)=> {
        //         if(cur.indexOf("user_") !== -1){
        //             return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
        //         }
        //         return {...acc, [cur]: _post[cur]}
        //     }, {id: doc.id, user_info: {}})
        //     setPost(post)
        // });
        //const q = query(postDB, where("capital", "==", true));
    }, [])

    return (
        <PostDetail>
            {post && <Post {...post} my_post={post.user_info.user_id === user_info?.uid}/>}
            <Permit>
                <CommentList post_id={url_id}/>
                <CommentWrite post_id={url_id}/>
            </Permit>
        </PostDetail>
    );
};
const PostDetail = styled.div`
    margin: 0 auto;
    padding: 2rem 0 8rem;
    width: 40rem;
    display: flex;
    align-items: center;
    flex-direction: column;
`

export default Detail;