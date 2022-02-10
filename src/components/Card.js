import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Card = (props) => {
    const navigate = useNavigate();
    const {image_url, user_name, post_id} = props;

    return (
      <CardNotic onClick={() => {navigate(`/detail/${post_id}`)}}>
        <div className="card-head">
          <img src={image_url} alt="해당 글 사진"/>
        </div>
        <div className="card-content">
          <p>
            <b>{user_name}</b>님이 게시글에 댓글을 <br/>남겼습니다
          </p>
        </div>
      </CardNotic>
    );
}

Card.defaultProps = {
    image_url: "http://via.placeholder.com/400x300",
};

const CardNotic = styled.div`
    margin-bottom: 2rem;
    padding: 1rem 1rem;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #dddddd;
    .card-head{
        margin-right: 2rem;
        display: flex;
        img{
            width: 8rem;
            height: 7rem;
        }
    }
    .card-content{
        text-align: left;
        b {
            font-weight: bold;
        }
    }
`

export default Card;