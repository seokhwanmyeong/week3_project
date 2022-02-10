/* Package & Library */
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';

/* CSS */
import '../css/App.css';

/* Pages*/
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Detail from '../pages/Detail';
import PostWrite from '../pages/PostWrite';
import NotFound from '../pages/NotFound'
import Notification from '../pages/Notification';

/* Source */
import {actionCreator} from '../redux/modules/user';
import {apiKey} from '../shared/firebase'

/* Components */
import {Header} from '../components/component';

function App() {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const isSession = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if(isSession){
      dispatch(actionCreator.loginCheckFB());
    }
  }, [])

  return (
    <div className="App">
      <div className='wrap'>
        <Header/>
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/detail/:id' element={<Detail />} />
            <Route path='/postwrite' element={<PostWrite />} />
            <Route path='/postwrite/:id' element={<PostWrite />} />
            <Route path='/notification' element={<Notification />}/>
            <Route path="/*" element={<NotFound />}/>
          </Routes>
        </Container>
      </div>
    </div>
  );
}
const Container = styled.div`
  margin-top: 4rem;
  padding: 4rem 0;
`
export default App;
