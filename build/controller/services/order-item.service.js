"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderItem = deleteOrderItem;
exports.getOrderItemById = getOrderItemById;
const repositories_1 = require("../repositories");
async function deleteOrderItem(req, res) {
    const { id } = req.params;
    await (0, repositories_1.deleteOrderItemById)(id);
    res
        .status(200)
        .json({ success: true, message: "Order item deleted successfully" });
}
async function getOrderItemById(req, res) {
    const { id } = req.params;
    const orderItem = await (0, repositories_1.findOrderItemById)(id);
    if (!orderItem) {
        res.status(404).json({ success: false, message: "Order item not found" });
    }
    res.status(200).json({ success: true, data: orderItem });
}
//# sourceMappingURL=order-item.service.js.map