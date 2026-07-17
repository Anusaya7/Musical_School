'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'

export interface Course {
  id: string
  title: string
  instructor: string
  price: number
  level: string
  duration: string
  image?: string
  description?: string
  category?: string
  rating?: number
  students?: number
}

export interface CartItem extends Course {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

interface CartContextType extends CartState {
  addItem: (course: Course) => void
  removeItem: (courseId: string) => void
  clearCart: () => void
  isInCart: (courseId: string) => boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Course }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper function to parse price from string or number
const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') {
    return price
  }
  if (typeof price === 'string') {
    // Remove currency symbols and convert to number
    return parseFloat(price.replace(/[^0-9.]/g, ''))
  }
  return 0
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        // Item already exists, don't add duplicate
        return state
      }
      
      const newItem: CartItem = {
        ...action.payload,
        quantity: 1
      }
      
      const updatedItems = [...state.items, newItem]
      const total = updatedItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total,
        itemCount
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total,
        itemCount
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }
    
    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + parsePrice(item.price), 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: action.payload,
        total,
        itemCount
      }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!mounted) return
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [mounted])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items, mounted])

  const addItem = (course: Course) => {
    dispatch({ type: 'ADD_ITEM', payload: course })
    
    // Show toast notification
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast('Added to Cart', 'success')
    }
  }

  const removeItem = (courseId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: courseId })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const isInCart = (courseId: string): boolean => {
    return state.items.some(item => item.id === courseId)
  }

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    clearCart,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
