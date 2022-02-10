import {createAction, handleActions} from 'redux-actions';
import {collection, doc, getDoc, getDocs, addDoc, deleteDoc, updateDoc, query, orderBy, limit, startAt} from 'firebase/firestore';
import {uploadString, ref, getDownloadURL} from "firebase/storage";
import {produce} from "immer";
import moment from "moment";

import {db, storage} from '../../shared/firebase';
import {actionCreator as imgActions} from './image';

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";
const DELETE = 'DELETE';

// action creators
const setPost = createAction(SET_POST, (post_list, paging) => ({post_list, paging}));
const addPost = createAction(ADD_POST, (post) => ({post}));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
    post_id,
    post,
}));
const loading = createAction(LOADING, (isLoading) => ({isLoading}))
const deletePost = createAction(DELETE, (post_id) => ({post_id}))

// initialState
const initialState =  {
    list: [],
    paging: {
        start: null,
        next: null,
        size: 4
    },
    isLoading: false,
};

const initialPost = {
    // id: 0,
    // user_info: {
    //     user_name: "mean0",
    //     user_profile: "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748",
    // },
    image_url: "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/%EC%9D%BC%EC%96%B4%EB%82%98_%EC%BD%94%EB%94%A9%ED%95%B4%EC%95%BC%EC%A7%80_cropped_ccexpress.jpeg?alt=media&token=ed1128a4-9399-4db0-8a3d-a5a878312155",
    contents: "",
    comment_cnt: 0,
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    //insert_dt: "2021-02-27 10:00:00",
};

// middleware
const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState) {
        if (!post_id) {
            console.log("게시물 정보가 없어요!");
            return;
        }

        const _img = getState().img.preview;

        const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
        const _post = getState().post.list[_post_idx];

        console.log(_post);

        const postDB = doc(db, "post", post_id);

        if (_img === _post.image_url) {
            updateDoc(postDB, post)
            .then((doc) => {
                dispatch(editPost(post_id, { ...post }));
                window.location.replace('/');
                //history.replace("/");
            })
            .catch((error) => {
                console.log(error)
            })
            // postDB
            //     .doc(post_id)
            //     .update(post)
            //     .then((doc) => {
            //         dispatch(editPost(post_id, { ...post }));
            //         //history.replace("/");
            //     });

            return;
        } else {
            const user_id = getState().user.user.uid;
            const storageRef = ref(storage, `images/${user_id}_${new Date().getTime()}`);
            const _upload = uploadString(storageRef, _img, 'data_url')
            // const _upload = storage
            //     .ref(`images/${user_id}_${new Date().getTime()}`)
            //     .putString(_image, "data_url");

            _upload.then((snapshot) => {
                getDownloadURL(snapshot.ref)
                .then((url) => {
                    console.log(url);

                    return url;
                })
                .then((url) => {
                    updateDoc(postDB, { ...post, image_url: url })
                    .then((doc) => {
                        dispatch(editPost(post_id, { ...post, image_url: url }));
                        window.location.replace('/');
                        //history.replace("/");
                    });
                    // postDB
                    // .doc(post_id)
                    // .update({ ...post, image_url: url })
                    // .then((doc) => {
                    //     dispatch(editPost(post_id, { ...post, image_url: url }));
                    //     //history.replace("/");
                    // });
                })
                .catch((error) => {
                    window.alert("앗! 이미지 업로드에 문제가 있어요!");
                    console.log("앗! 이미지 업로드에 문제가 있어요!", error);
                });
            });
        }
    };
};
  
const addPostFB = (contents="", layer) => {
    return async function (dispatch, getState){
        const _user = getState().user.user;
        const user_info = {
            user_id: _user.uid,
            user_name: _user.user_name,
            user_profile: _user.user_profile,
        };
        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
            layer: layer
        }
        const like_list = {
            write_id: _user.uid,
            list_cnt: 0,
            check_id: [],
        }


        const _img = getState().img.preview;
        console.log(_img);

        const storageRef = ref(storage, `images/${user_info.user_id}_${new Date().getTime()}`);
        const _upload = uploadString(storageRef, _img, 'data_url')
        .then((snapshot) => {
            console.log('Uploaded a data_url string!');
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);

                return url;
            }).then(url => {
                const newPost = {...user_info, ..._post, image_url: url, like: like_list}
                const postDB = addDoc(collection(db, "post"), newPost)
                .then((doc) => {
                    let post = {user_info, ..._post, id: doc.id, image_url: url, like: like_list};
                    console.log("post작성완료")
                    dispatch(addPost(post));
                    dispatch(imgActions.setPreview(null));
                    window.location.replace('/');
                    // "/" replace
                })
                .catch((error) => {
                    window.alert("포스트 작성에 문제가 생겼습니다");
                    console.log("addDoc 작성실패", error);
                    window.location.replace('/');
                })
            }).catch((error) => {
                window.alert("이미지 업로드에 문제가 생겼습니다");
                console.log("getDownloadURL 이미지업로드 문제", error);
                window.location.replace('/');
                // "/" replace
            })
        });
    }
}
const getPostFB = (start = null, size = 4) => {
    return async function (dispatch, getState){
        let _paging = getState().post.paging;
        if(_paging.start && !_paging.next){
            return;
        }

        // loading = true로 dispatch
        dispatch(loading(true));

        // // 단순히 list만을 불러오기위한 getDocs 코드
        //const postDB = await getDocs(collection(db, "post"));

        const postOriginDB = collection(db, "post")
        let _query = query(postOriginDB, orderBy("insert_dt", "desc"), limit(size + 1));
        if(start) _query = query(postOriginDB, orderBy("insert_dt", "desc"), limit(size + 1), startAt(start));
        // // 위 query를 적용한 postDB를 함축한 코드
        // const postDB = await getDocs(query(
        //     collection(db, "post"), 
        //     orderBy("insert_dt", "desc"), 
        //     limit(size + 1),
        //     start && startAt(start),
        //     ))

        const postDB = await getDocs(_query).then((docs) => {
            let post_list = [];
            let paging = {
                start: docs.docs[0],
                next: docs.docs.length === size+1? docs.docs[docs.docs.length - 1] : null,
                size: size,
            };
            //console.log(paging)
            docs.forEach((list) => {
                let _post = list.data();
                let post = Object.keys(_post).reduce((acc, cur)=> {
                    if(cur.indexOf("user_") !== -1){
                        return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
                    }
                    return {...acc, [cur]: _post[cur]}
                }, {id: list.id})
    
                post_list.push(post)
            })
            post_list.pop();

            dispatch(setPost(post_list, paging));
        })

        //console.log(post_list)

        return;
        // //배열 순서변화를 위한 query를 넣기전 코드
        // postDB.forEach((list) => {
        //     let _post = list.data();
        //     let post = Object.keys(_post).reduce((acc, cur)=> {
        //         if(cur.indexOf("user_") !== -1){
        //             return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
        //         }
        //         return {...acc, [cur]: _post[cur]}
        //     }, {id: list.id})

        //     post_list.push(post)
        // })
        // //console.log(post_list)

        // dispatch(setPost(post_list));
    }
}

const getOnePostFB = (id) => {
    return function(dispatch, getState){
        const postRef = doc(db, "post", id)
        const postDB = getDoc(postRef).then((doc) => {
            // console.log(doc);
            // console.log(doc.data());
            let _post = doc.data()
            if (!_post) {
                return;
            }

            let post = Object.keys(_post).reduce((acc, cur)=> {
                if(cur.indexOf("user_") !== -1){
                    return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
                }
                return {...acc, [cur]: _post[cur]}
            }, {id: doc.id, user_info: {}});
            dispatch(setPost([post]));
        });
    }
}

const deletePostFB = (target_id) => {
    return async function (dispatch, getState) {
        if(!target_id) window.alert("데이터 아이디가 없네요");
        const postRef = doc(db, "post", target_id);
        //const commentRef = doc(db, "comment", target_id);

        await deleteDoc(postRef);
        window.location.replace('/');
        dispatch(deletePost(target_id));
    }
}

//reducer
export default handleActions({
    [SET_POST] : (state, action) => produce(state, (draft) => {
        //draft.list = action.payload.post_list;
        draft.list.push(...action.payload.post_list);
        draft.list = draft.list.reduce((acc, cur) => {
            if(acc.findIndex(a => a.id === cur.id) === -1){
                return [...acc, cur];
            }else{
                acc[acc.findIndex(a => a.id === cur.id)] = cur;
                return acc;
            }
        }, []);
        if(action.payload.paging){
            draft.paging = action.payload.paging;
        }
        draft.isLoading = false;
    }),
    [ADD_POST] : (state, action) => produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
    }),
    [EDIT_POST]: (state, action) => produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
    }),
    [LOADING]: (state, action) => produce(state, (draft) => {
        draft.isLoading = action.payload.isLoading;
    }), 
    [DELETE]: (state, action) => produce(state, (draft) => {
        let delete_list = draft.list.filter(cur => {
            return cur.id !== action.payload.post_id;
        })
        draft.list = {...delete_list}
    })
}, initialState);

const actionCreator = {
    setPost, 
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    getOnePostFB,
    deletePostFB,
}   

export {actionCreator};