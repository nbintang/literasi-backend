import route from "../lib/router";
import { getUserById, getUsers } from "../core/services/user.service";
import { authMiddleware } from "../middleware";

route.get("/users", authMiddleware, getUsers);
route.get("/users/:id", authMiddleware, getUserById);

export { route as userRoute };
