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
import {ref, update, push, set} from "firebase/database";
import { produce } from "immer";
import moment from "moment";

// source
import {actionCreator as postActions} from "./post";
import {db, realtime} from '../../shared/firebase';

// actions
const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT"
const LOADING = "LOADING";

// action create
const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));
const deleteComment = createAction(DELETE_COMMENT, (post_id) => ({post_id}))
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));


// initialState
const initialState = {
    list: {},
    is_loading: false,
};

// middleware
const addCommentFB = (post_id, contents) => {
  return function(dispatch,  getState){
    //const commentOriginDB = collection(db, "comment");
    const user_info = getState().user.user;

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    
    const commentDB = addDoc(collection(db, "comment"), comment)
    .then((_doc) => {
      const postDB = doc(db, "post", post_id);
      const post = getState().post.list.find(l => l.id === post_id);
      comment = {...comment, id: _doc.id}

      updateDoc(postDB, {comment_cnt: increment(1)})
      .then((_post) => {
        dispatch(addComment(post_id, comment));
        if(post){
          dispatch(postActions.editPost(post_id, {comment_cnt: parseInt(post.comment_cnt) + 1}));
          // console.log("댓슬 작성자 id : " + user_info.uid)
          // console.log("글 작성자 id : " + post.user_info.user_id)
          // return;
          if(user_info.uid !== post.user_info.user_id){
            const _noti_item = ref(realtime, 'noti/' + post.user_info.user_id + '/list');
            const noti_item = push(_noti_item);
            set(noti_item, {
              post_id: post.id,
              user_name: comment.user_name,
              image_url: post.image_url,
              insert_dt: comment.insert_dt
            }).then(() => {
              const notiDB = ref(realtime, 'noti/' + post.user_info.user_id);
              update(notiDB, {read: false});
            }).catch((error) => {
              console.log("알림저장실패! noti_item")
            }) 
          }
          // if(user_info.uid !== post.user_info.user_id){
          //   const _noti_item = ref(realtime, 'noti/' + post.user_info.user_id);
          //   const noti_item = push(child(ref(_noti_item), 'list')).key;
          //   set(noti_item, {
          //     post_id: post.id,
          //     user_name: comment.user_name,
          //     image_url: post.image_url,
          //     insert_dt: comment.insert_dt
          //   }, (error) => {
          //     if(error){
          //       console.log("알림저장실패! noti_item")
          //     }else{
          //       const notiDB = ref(realtime, 'noti/' + post.user_info.user_id);
          //       update(notiDB, {read: false});
          //     }
          //   })
          // }
          // if(user_info.uid !== post.user_info.user_id){
          //   const notiDB = ref(realtime, 'noti/' + post.user_info.user_id);
          //   update(notiDB, {read: false});
          // }
        }
      })
    })
  }
}

const getCommentFB = (post_id = null) => {
    return function(dispatch, getState){
      if(!post_id) return;
      const commentOriginDB = collection(db, "comment")
      const _query = query(
        commentOriginDB, 
        where("post_id", "==", post_id),
        orderBy("insert_dt", "desc")
      );
      const commentDB = getDocs(_query).then((docs) => {
        let comment_list = [];

        docs.forEach((doc) => {
          comment_list.push({...doc.data(), id: doc.id});
        });

        dispatch(setComment(post_id, comment_list));
      }).catch((error) => {
        console.log("댓글정보 get(commentDB) 관련 에러발생", error);
      })

    }
}


export default handleActions(
  {
    [SET_COMMENT]: (state, action) => produce(state, (draft) => {
      // let data = {[post_id]: comment_list, ....}방식으로
      draft.list[action.payload.post_id] = action.payload.comment_list
    }),
    [ADD_COMMENT]: (state, action) => produce(state, (draft)=> {
      draft.list[action.payload.post_id].unshift(action.payload.comment);
    }),
    [DELETE_COMMENT]: (state, action) => produce(state, (draft)=> {
      draft.list[action.payload.post_id].unshift(action.payload.comment);
    }),
    [LOADING]: (state, action) => 
        produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
    })
  },
  initialState
);

const actionCreators = {
  setComment,
  addComment,
  getCommentFB,
  addCommentFB,
};

export { actionCreators };