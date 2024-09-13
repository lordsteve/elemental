import Model from './model';
import SessionStorage from './sessionStorage';
import User from './user';

export { default as Model } from './model';
export { default as SessionStorage } from './sessionStorage';
export { default as User } from './user';

const Models = {
    Model,
    User,
    SessionStorage
};
export default Models;