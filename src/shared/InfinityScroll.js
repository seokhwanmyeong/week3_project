import React from 'react';
import _ from 'lodash';

import {Spinner} from '../elements/element'

const InfinityScroll = (props) => {
    const {children, callNext, isNext, loading} = props;

    const _handleScroll = _.throttle(() => {
        if(loading){
            return;
        }
        const {innerHeight} = window;
        const {scrollHeight} = document.body;
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if(scrollHeight - innerHeight - scrollTop < 200){
            callNext();
        }
    }, 300);

    const handleScroll = React.useCallback(_handleScroll, [loading]);


    React.useEffect(() => {
        if(loading){
            return;
        }
        if(isNext){
            window.addEventListener("scroll", handleScroll);
        }else{
            window.removeEventListener("scroll", handleScroll);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isNext, loading]);

    return (
        <React.Fragment>
            {props.children}
            {isNext && (<Spinner/>)}
        </React.Fragment>
    );
};
InfinityScroll.defaultProps = {
    children: null,
    callNext: () => {},
    isNext: false,
    loading: false,
}

export default InfinityScroll;