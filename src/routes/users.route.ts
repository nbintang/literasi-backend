import route from "../lib/router";
import {
  getUserById,
  getUsers,
} from "../core/services/user.service";
route.get("/users", getUsers);
route.get("/users/:id", getUserById);

// route.get("/")

export { route as userRoute };
