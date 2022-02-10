import React from 'react';
import {storage} from './firebase';
import {useDispatch, useSelector} from "react-redux";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

import {actionCreator} from '../redux/modules/image';

import {Btn} from '../elements/element'

const Upload = (props) => {
    const dispatch = useDispatch();
    const uploading = useSelector((state) => state.img.uploading);
    const fileInput = React.useRef();

    const selectFile = (e) => {
        // console.log(e);
        // console.log(e.target);
        // console.log(e.target.files[0]);
        // console.log(fileInput.current.files[0]);

        const reader = new FileReader();
        const currentFile = fileInput.current.files[0]

        reader.readAsDataURL(currentFile);

        reader.onloadend = () => {
            //console.log(reader.result)
            dispatch(actionCreator.setPreview(reader.result))
        }
    } 
    const uploadFB = () => {
        if (!fileInput.current || fileInput.current.files.length === 0) {
          window.alert("파일을 선택해주세요!");
          return;
        }
    
        dispatch(actionCreator.uploadImgFB(fileInput.current.files[0]));
    };

    return (
        <React.Fragment>
            <input type='file' onChange={selectFile} ref={fileInput} disabled={uploading} />
            {/* <Btn eventType={"click"} event={uploadFB} text={"업로드하기"}/> */}
        </React.Fragment>
    );
};

export default Upload;