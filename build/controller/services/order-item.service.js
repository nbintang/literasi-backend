"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderItemById = getOrderItemById;
exports.deleteOrderItem = deleteOrderItem;
const repositories_1 = require("@/controller/repositories");
const error_response_1 = require("@/helper/error-response");
async function getOrderItemById(req, res, next) {
    try {
        const { id } = req.params;
        const orderItem = await (0, repositories_1.findOrderItemById)(id);
        if (!orderItem)
            throw new error_response_1.CustomError("Order item not found", 404);
        res.status(200).json({ success: true, data: orderItem });
    }
    catch (error) {
        next(error);
    }
}
async function deleteOrderItem(req, res, next) {
    try {
        const { id } = req.params;
        const orderItem = await (0, repositories_1.deleteOrderItemById)(id);
        if (!orderItem)
            throw new error_response_1.CustomError("Order item not found", 404);
        res
            .status(200)
            .json({ success: true, message: "Order item deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order-item.service.js.map