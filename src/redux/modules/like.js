import { createAction, handleActions } from "redux-actions";
import {
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  increment
} from 'firebase/firestore';
import { produce } from "immer";

import {actionCreator as postActions} from "./post";
import {db, storage} from '../../shared/firebase';

// actions
const ADD_LIKE = "ADD_LIKE";
const SET_LIKE = "SET_LIKE";
const CHECK_LIKE = "CHECK_LIKE";
const UNCHECK_LIKE = "UNCHECK_LIKE";

// actions create
const checkLike = createAction(CHECK_LIKE, (user_id) => ({user_id}));
const uncheckLike = createAction(UNCHECK_LIKE, (user_id) => ({user_id}));

// initialState
const initialState = {
    like_list : {}
};

// middle
const checkLikeFB = (post_id, user_id) => {
    return async function(dispatch, getState){
        if (!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }
        const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
        const _post = getState().post.list[_post_idx];
        const likeDB = _post.like;
        const new_likeDB = {like: {...likeDB, check_id: [...likeDB.check_id, user_id], list_cnt: parseInt(likeDB.list_cnt) + 1}};
        //console.log(new_likeDB)

        const postDB = doc(db, "post", post_id);
        updateDoc(postDB, new_likeDB).then(() => {
            dispatch(postActions.editPost(post_id, new_likeDB))
            console.log("업데이트 성공")
        }).catch((error) => {
            console.log("checkLikeFB -> updateDoc error");
            console.log(error)
        })

    }
}

const uncheckLikeFB = (post_id, user_id) => {
    return function(dispatch, getState){
        if (!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }
        const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
        const _post = getState().post.list[_post_idx];
        const likeDB = _post.like;
        const _likeDB = likeDB.check_id.filter(cur => {
            return cur !== user_id;
        }, [])
        //console.log(likeDB)

        const new_likeDB = {like: {...likeDB, check_id: [..._likeDB], list_cnt: parseInt(likeDB.list_cnt) - 1}};
        const postDB = doc(db, "post", post_id);
        updateDoc(postDB, new_likeDB).then(() => {
            dispatch(postActions.editPost(post_id, new_likeDB))
            console.log("업데이트 성공")
        }).catch((error) => {
            console.log("checkLikeFB -> updateDoc error");
            console.log(error)
        })
    }
}

// reducer
export default handleActions(
  {
    [CHECK_LIKE]: (state, action) => produce(state, (draft) => {
        draft.id_list = action.payload.comment_list
    }),
    [UNCHECK_LIKE]: (state, action) => produce(state, (draft)=> {
        draft.id_list.unshift(action.payload.comment);
    }),
  },
  initialState
);

const actionCreators = {
    checkLike,
    uncheckLike,
    checkLikeFB,
    uncheckLikeFB,
};

export {actionCreators};