import express from "express";
import authMiddleware from "../middleware/auth.js";
import { confirmPayment, createOrder, deleteOrder, getorderById, getorders, getUserOrders, updateOrder } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";


const orderRouter = express.Router();


// protected routes
orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/confirm', authMiddleware, confirmPayment);


//Public routes
orderRouter.get('/', adminAuth, getorders);
orderRouter.get('/user', authMiddleware, getUserOrders);
orderRouter.get('/:id', getorderById);
orderRouter.put('/:id', adminAuth, updateOrder);

orderRouter.delete('/:id', adminAuth, deleteOrder);

export default orderRouter;