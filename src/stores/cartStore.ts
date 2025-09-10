import { CartStoreActionType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<
    CartStoreStateType & CartStoreActionType,
    [["zustand/persist", unknown]]
>(
    persist<CartStoreStateType & CartStoreActionType>(
        (set) => ({
            cart: [], //state
            hasHydrated: false,
            addToCart: (product) =>
                set((state) => {
                    const existingIndex = state.cart.findIndex(
                        (p) =>
                            p.id === product.id &&
                            p.selectedSize === product.selectedSize &&
                            p.selectedColor === product.selectedColor
                    );

                    if (existingIndex !== -1) {
                        const updatededCart = [...state.cart];
                        updatededCart[existingIndex].quantity +=
                            product.quantity || 1;
                        return { cart: updatededCart };
                    }

                    return {
                        cart: [
                            ...state.cart,
                            {
                                ...product,
                                quantity: product.quantity || 1,
                                selectedSize: product.selectedSize,
                                selectedColor: product.selectedColor,
                            },
                        ],
                    };
                }),
            removeFromCart: (product) =>
                set((state) => ({
                    cart: state.cart.filter(
                        (p) =>
                            !(
                                p.id === product.id &&
                                p.selectedColor === product.selectedColor &&
                                p.selectedSize === product.selectedSize
                            )
                    ),
                })),
            clearCart: () => set({ cart: [] }),
        }),
        {
            name: "cart",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.hasHydrated = true;
                }
            },
        }
    )
);

export default useCartStore;
