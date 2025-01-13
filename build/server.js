"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 3001;
dotenv_1.default.config();
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (_, res) => {
    res.send("Hello World!");
});
app.use("/api", routes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map