// import { postsRoute } from './books.route';
import route from '../lib/router';
import { userRoute } from './users.route';
import { authRoute } from './auth.route';
// route.use(postsRoute);
route.use(userRoute);
route.use(authRoute);
export default route;