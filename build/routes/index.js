"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const users_route_1 = require("./users.route");
const auth_route_1 = require("./auth.route");
const books_route_1 = require("./books.route");
const middleware_1 = require("../middleware");
route.use("/books", middleware_1.authMiddleware, books_route_1.bookRoute);
route.use("/users", middleware_1.authMiddleware, users_route_1.userRoute);
route.use(auth_route_1.authRoute);
exports.default = route;
//# sourceMappingURL=index.js.map