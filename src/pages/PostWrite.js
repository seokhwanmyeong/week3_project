import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import styled, {css} from 'styled-components';

import {actionCreator as postActions} from '../redux/modules/post';
import {actionCreator as imgActions} from '../redux/modules/image'
import Upload from '../shared/Upload';

import {Title} from '../components/component'

import {Btn} from '../elements/element';

const PostWrite = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const isLogin = useSelector((state) => state.user.isLogin);
    const preview = useSelector((state) => state.img.preview);
    const post_list = useSelector((state) => state.post.list);
    
    const post_id = params.id
    const is_edit = post_id ? true : false;
    let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
    console.log(_post)
    const [contents, setContents] = useState(_post ? _post.contents : "");
    // console.log(contents)
    const [layer, setLayer] = useState("normal")

    React.useEffect(() => {
        if (is_edit && !_post) {
          console.log("포스트 정보가 없어요!");
    
          return;
        }
    
        if (is_edit) {
          dispatch(imgActions.setPreview(_post.image_url));
        }
    }, []);

    const changeContent = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents, layer));
    }

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, {contents: contents, layer: layer}));
    }
    
    const handleChange = (e) => {
        setLayer(e.target.value)
    }
    console.log(layer)
    if(!isLogin){
        return(
            <WrongPage>
                <Title>멈춰!</Title>
                <p>로그인 후에만 사용 가능합니다</p>
                <Btn _click={() => {navigate("/login", {replace: true})}} text={"로그인하러 가기"}/>
            </WrongPage>
        )
    }
    return (
        <FormWrite>
            <div className='write-head'>
                <Title text={is_edit? "게시글 수정" : "게시글 작성"} />
            </div>
            <WritePreview layer_type={"normal"}>
                <label>
                    <input type='radio' name='layer' value='normal' checked={layer === "normal"} onChange={handleChange}/>
                </label>
                <div className='preview-img'>
                    <img src={preview ? preview : "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/images%2Fpicture.svg?alt=media&token=45418417-5864-4e67-a034-9f790ceab4e6"} alt='test'/>
                </div>
                <div className='preview-text'>
                    <p>{contents}</p>
                </div>
            </WritePreview>
            <WritePreview layer_type={"left"}>
                <label>
                    <input type='radio' name='layer' value='left' checked={layer === "left"} onChange={handleChange}/>
                </label>
                <div className='preview-img'>
                    <img src={preview ? preview : "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/images%2Fpicture.svg?alt=media&token=45418417-5864-4e67-a034-9f790ceab4e6"} alt='test'/>
                </div>
                <div className='preview-text'>
                    <p>{contents}</p>
                </div>
            </WritePreview>
            <WritePreview layer_type={"right"}>
                <label>
                    <input type='radio' name='layer' value='right' checked={layer === "right"} onChange={handleChange}/>
                </label>
                <div className='preview-img'>
                    <img src={preview ? preview : "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/images%2Fpicture.svg?alt=media&token=45418417-5864-4e67-a034-9f790ceab4e6"} alt='test'/>
                </div>
                <div className='preview-text'>
                    <p>{contents}</p>
                </div>
            </WritePreview>
            <div className='write-content'>
                <label>
                    <textarea onChange={changeContent} placeholder='게시글을 작성해주세요.' value={contents}></textarea>
                </label>
            </div>
            <div className='upload-img'>
                <label>
                    <Upload />
                </label>
            </div>
            {is_edit ? (
                <Btn _click={editPost} text={"수정 완료"}/>
            ) : (
                <Btn _click={addPost} text={"작성 완료"}/>
            )}
        </FormWrite>
    );
};
const WrongPage = styled.div`
    h4{
        margin-bottom: 2rem;
        font-size: 1.5rem;
    }
    p{
        margin-bottom: 2rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
const FormWrite = styled.form`
    margin: 0 auto;
    width: 40rem;
    .write-content{
        textarea{
            padding: 2rem;
            width: 100%;
            height: 15rem;
        }
    }
    .upload-img{
        margin-bottom: 3rem;
        text-align: left;
    }
`

const WritePreview = styled.div`
    display: flex;
    position: relative;
    margin-bottom: 3rem;
    border: 1px solid #dddddd;
    cursor: pointer;
    label{
        position: absolute;
        top: 1rem;
        left: 1rem;
        input{
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 1px solid #dddddd;
            -webkit-appearance: auto;
            appearance: auto;
        }
    }
    ${props => props.layer_type === "left" ? css`
        flex-direction: row;
        .preview-text{
            padding: 2rem;
            width: 50%;
            p{
                text-align:left;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                max-height: 42rem;
            }
        }
        .preview-img{
            width: 50%;
            border-right: 1px solid #dddddd;
            img{
                width: 100%;
            }
        }
    ` : props.layer_type === "right" ? css`
        flex-direction: row-reverse;
        .preview-text{
            padding: 2rem;
            width: 50%;
            p{
                text-align:left;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                max-height: 42rem;
            }
        }
        .preview-img{
            width: 50%;
            border-left: 1px solid #dddddd;
            img{
                width: 100%;
            }
        }
    ` : css`
        flex-direction: column;
        .preview-img{
            padding: 2rem;
            width: 100%;
            border-bottom: 1px solid #dddddd;
            img{
                width: 100%;
            }
        }
        .preview-text{
            padding: 2rem;
            p{
                text-align:left;
                overflow-y: scroll;
                text-overflow: ellipsis;
                word-break: break-all;
                max-height: 42rem;
            }
        }
    `}
`

export default PostWrite;