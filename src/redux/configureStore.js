import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

// source : modules
import {db} from '../shared/firebase';
import User from './modules/user';
import Post from './modules/post';
import Image from './modules/image';
import Comment from './modules/comment';
import Like from './modules/like'

const rootReducer = combineReducers({
  user : User,
  post : Post,
  img: Image,
  comment: Comment,
  like: Like,
});

const middlewares = [thunk];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서 logger 추가
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
);

let store =  createStore(rootReducer, enhancer);
export default store;
