import { TypeIcon } from "lucide-react";
import { Children, createContext, useEffect, useReducer } from "react";

const CartContext = createContext()

const loadInitialState = () => {
    if (typeof window !== 'undefined'){
        const saved = localStorage.getItem('cart')

        try {
            const parsed = saved ? JSON.parse(saved) : null 
            if (parsed && Array.isArray(parsed.item)) return parsed
            return { items: []}
        }
        catch (error) {
            return {items: []}
        }
    }
    return {items : []}
}

const cartReducer = (state, action) => {

}


export const CartProvider = ({ children}) => {
    const [state, dispatch] = useReducer(cartReducer, {}, loadInitialState)

    useEffect(() => {
        
    })
}