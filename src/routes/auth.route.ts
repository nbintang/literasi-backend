import route from "../lib/router";
import { signIn, signUp } from "../core/services/auth.service";

route.post("/signup", signUp);
route.post("/signin", signIn);

export { route as authRoute };
