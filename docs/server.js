"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use(express.static(__dirname));
app.listen(4200);
//# sourceMappingURL=server.js.map