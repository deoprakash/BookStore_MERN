import express from "express";
import authMiddleware from "../middleware/auth.js";
import { confirmPayment, createOrder, deleteOrder, getorderById, getorders, getUserOrders, updateOrder } from "../controllers/orderController.js";


const orderRouter = express.Router();


// protected routes
orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/confirm', authMiddleware, confirmPayment);


//Public routes
orderRouter.get('/', getorders);
orderRouter.get('/user', authMiddleware, getUserOrders);
orderRouter.get('/:id', getorderById);
orderRouter.put('/:id', updateOrder);

orderRouter.delete('/:id', deleteOrder);

export default orderRouter;