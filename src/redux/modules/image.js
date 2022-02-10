import {createAction, handleActions} from 'redux-actions';
import {ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import {produce} from "immer";

import {storage} from '../../shared/firebase';

// actions
const UPLODING = "UPLODING";
const UPLOAD_IMG = "UPLOAD_IMG";
const SET_PREVIEW = "SET_PREVIEW";
//const DELETE_IMG = "DELETE_IMG"

// action creators
const uploading = createAction(UPLODING, (uploading) => ({uploading}));
const uploadImg = createAction(UPLOAD_IMG, (img_url) => ({img_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));
//const deleteImg = createAction(DELETE_IMG, (delete_img) => ({delete_img}))

// initialState
const initialState = {
    img_url: '',
    uploading: false,
    preview: null,
}

//
const uploadImgFB = (image) => {
    return async function(dispatch, getState){
        dispatch(uploading(true));

        const _upload = ref(storage, `images/${image.name}`);
        const upload = uploadBytesResumable(_upload, image)
        .then((snapshot) => {
            //console.log(snapshot);
            console.log("이미지 업로드 완료");
            getDownloadURL(snapshot.ref).then((url) => {
                dispatch(uploadImg(url));
                console.log(url);
            })
        })
    }
}
const deleteImgFB = (image) => {
    return async function(dispatch, getState){
        const _deleteImg = ref(storage, `images/${image}`);
        const deleteImg = deleteObject(_deleteImg).then(() => {
            console.log("이미지 삭제완료");
        }).catch((error) => {
            console.log("이미지 삭제오류", error);
        })
    }
}

//reducer
export default handleActions({
    [UPLOAD_IMG] : (state, action) => produce(state, (draft) => {
        draft.img_url = action.payload.img_url;
        draft.uploading = false;
    }),
    [UPLODING] : (state, action) => produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
    }),
    [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
        draft.preview = action.payload.preview;
    }),
}, initialState);

const actionCreator = {
    uploadImg, 
    uploadImgFB,
    setPreview,
    deleteImgFB,
}   

export {actionCreator};