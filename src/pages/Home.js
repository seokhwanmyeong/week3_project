import React from 'react';
import {useNavigate} from 'react-router-dom';

// source
import Permit from '../shared/Permit';

// pages
import PostList from './PostList';

// elements
import {Btn} from '../elements/element';

const Home = (props) => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <PostList/>
            <Permit>
                <Btn _click={() => {navigate("/postwrite")}} isFixed={"true"} text={"POST"}/>
            </Permit>
        </React.Fragment>
    );
};


export default Home;