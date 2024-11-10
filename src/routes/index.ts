import route from "../lib/router";
import { userRoute } from "./users.route";
import { authRoute } from "./auth.route";
import { bookRoute } from "./books.route";
route.use(bookRoute);
route.use(userRoute);
route.use(authRoute);
export default route;
