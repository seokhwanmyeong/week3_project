import React from "react";
import styled from "styled-components";
import {ref, onValue, update} from "firebase/database";
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

/* Source */
import {realtime} from '../shared/firebase'

/* Elements */
import {Btn} from '../elements/element';

/* IMG, ICONS*/
import {BellSvg} from "../icons/icons";

const NotiBadge = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [is_read, setIsRead] = React.useState(true);
    const user_id = useSelector((state) => state.user.user.uid);

    React.useEffect(() => {
        const notiDB = ref(realtime, 'noti/' + user_id + '/read');
        onValue(notiDB, (snapshot) => {
            setIsRead(snapshot.val())
        });

        //return () => notiDB.off();
    }, [])

    const NotiBtnEvent = () => {
        const notiDB = ref(realtime, `noti/` + user_id);
        update(notiDB, {read: true});
        navigate('/notification');
    }

    return (
        <Badge>
            <button onClick={NotiBtnEvent} className="btn__notice">
                <BellSvg/>
            </button>
            {/* <Btn _click={NotiBtnEvent} _class={"btn__notice"} icons={BellSvg} /> */}
            {(() => {
                if(is_read === false){
                    return (
                        <span></span>
                    )
                }
                return null;
            })()}
        </Badge>
    );
};
const Badge = styled.div`
    position: relative;
    margin-right: 1rem; 
    display: flex;
    svg{
        width: 1.5rem;
        height: 1.5rem;
        path{
            &:hover{
                fill: #777777;
            }
        }
    }
    span {
        position: absolute;
        top: 0rem;
        right: -0.2rem;
        display: block;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background-color: #ff0844;
        content: "10";
        line-height: 1.5rem; 
    }
`

export default NotiBadge;