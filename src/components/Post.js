import React from 'react';
import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components';
import {useDispatch} from 'react-redux';

import {actionCreator as postActions} from '../redux/modules/post'
import {actionCreator as imgActions} from '../redux/modules/image';

import {Like} from '../components/component';

import {Btn} from '../elements/element'

const Post = (props) => {
    //console.log(props)
    const {_onClick, layer} = props
    const dispatch = useDispatch();
    const img_name = props.image_url.split('images%2F')[1].split('?alt=media')[0]
    //console.log("프롭스요 : ", img_name)
    const deleteData = (target_id) => {
        dispatch(postActions.deletePostFB(target_id));
        dispatch(imgActions.deleteImgFB(img_name));
    };
    //console.log(layer)
    return (
        <React.Fragment>
            <PostLi>
                <div className='post-head'>
                    <img src="https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748" alt='사진'/>
                    {/* <img src={props.user_info.user_profile} alt='사진'/> */}
                    <p>{props.user_info.user_name}</p>
                    <p>{props.insert_dt}</p>
                    {props.my_post && (
                        <div className='btn-group'>
                            <Link to={`/postwrite/${props.id}`}>
                                <Btn eventType={"click"} text={"수정하기"} size={"small"}/>
                            </Link>
                            <Btn _click={() => deleteData(props.id)} text={"제거하기"} size={"small"}/>
                        </div>
                    )}
                </div>
                <Layer onClick={_onClick} layer={layer}>   
                    <div className='post-img'>
                        <img src={props.image_url} alt='사진'/>
                    </div>
                    <div className='post-content'>
                        <p>{props.contents}</p>
                    </div>
                </Layer>
                <div className='post-foot'>
                    <span>댓글 {props.comment_cnt}개</span><br/>
                    <Like post_id={props.id} />
                </div>
            </PostLi>
        </React.Fragment>
    );
};
const PostLi = styled.div`
    margin-bottom: 6rem;
    width: 100%;
    border: 1px solid #dddddd;
    .post-head{
        padding: 1rem 2rem;
        width: 100%;
        display: flex;
        align-content: center;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #dddddd;
        img{
            margin-right: 1rem; 
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            overflow: hidden;
        }
        p{
            padding: 0 1rem;
            text-align: left;
            width: 9rem;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .btn-group{
            a+button{
                margin-left: 0.5rem;
            }
        }
    }
    .post-foot{
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
    }
`
const Layer = styled.div`
    display: flex;
    cursor: pointer;
    ${props => props.layer === "left" ? css`
        flex-direction: row;
        border-bottom: 1px solid #dddddd;
        .post-content{
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
        .post-img{
            width: 50%;
            border-right: 1px solid #dddddd;
            img{
                width: 100%;
            }
        }
    ` : props.layer === "right" ? css`
        flex-direction: row-reverse;
        border-bottom: 1px solid #dddddd;
        .post-content{
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
        .post-img{
            width: 50%;
            border-left: 1px solid #dddddd;
            img{
                width: 100%;
            }
        }
    ` : css`
        flex-direction: column;
        .post-img{
            padding: 2rem;
            width: 100%;
            border-bottom: 1px solid #dddddd;
        }
        .post-content{
            padding: 2rem;
            border-bottom: 1px solid #dddddd;
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
//flex-direction: ${props => props.layer === "left" ? 'row;' : props.layer === "right" ? 'row-reverse;' : 'column;'}
Post.defaultProps = {
    user_info: {
      user_name: "mean0",
      user_profile: "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/KakaoTalk_20220207_224035293.jpg?alt=media&token=4f984c9d-27e4-42ae-bba7-f7b9fe594748",
    },
    image_url: "https://firebasestorage.googleapis.com/v0/b/project-week3-9a157.appspot.com/o/%EC%9D%BC%EC%96%B4%EB%82%98_%EC%BD%94%EB%94%A9%ED%95%B4%EC%95%BC%EC%A7%80_cropped_ccexpress.jpeg?alt=media&token=ed1128a4-9399-4db0-8a3d-a5a878312155",
    contents: "lorem testtesttest",
    comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
};

export default Post;