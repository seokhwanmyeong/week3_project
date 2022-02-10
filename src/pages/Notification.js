import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {ref, orderByChild, query, onValue} from "firebase/database";

import {realtime} from "../shared/firebase";

import {Card} from '../components/component'

const Notification = (props) => {
    const user = useSelector(state => state.user.user);
    const [noti, setNoti] = React.useState([]);

    React.useEffect(() => {
        if(!user){
            return;
        }

        const notiDB = ref(realtime, 'noti/' + user.uid + '/list')
        const _noti = query(notiDB, orderByChild('insert_dt'))
        onValue(_noti, (snapshot) => {
            const _data = (snapshot.val() && snapshot.val()) || 'Anonymous';

            let _noti_list = Object.keys(_data).reverse().map(cur => {
                return _data[cur]
            })

            setNoti(_noti_list);
        }, {onlyOnce: true})
    }, [user])

    return (
        <React.Fragment>
            <Notic>
                {noti.map((n, idx) => {
                    return <Card key={`noti_${idx}}`} {...n}/>;
                })}
            </Notic>
        </React.Fragment>
    );
}
const Notic = styled.div`
    margin: 0 auto;
    width: 35rem;
`
export default Notification;