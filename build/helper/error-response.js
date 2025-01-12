"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorResponse = handleErrorResponse;
function handleErrorResponse(res, error, status) {
    res.status(status || 500).json({ success: false, message: error.message });
}
//# sourceMappingURL=error-response.js.map