import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Context para inyectar la información global
export const Context = React.createContext(null);

// Función para inyectar el contexto a cualquier componente
const injectContext = PassedComponent => {
    const StoreWrapper = props => {
        // Estado principal del contexto
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: updatedStore =>
                    setState({
                        store: Object.assign(state.store, updatedStore),
                        actions: { ...state.actions }
                    })
            })
        );

        // Función para actualizar el carrito
        const setCart = updatedCart => {
            setState({
                store: {
                    ...state.store,
                    cart: updatedCart
                }
            });
        };

        const actions = {
            ...state.actions,
            setCart
        };

        useEffect(() => {
            /**
             * Ejecutar acciones al cargar la aplicación
             */
            actions.initializeCart();
            actions.getMessage();
        }, []);

        return (
            <Context.Provider value={{ ...state, actions }}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    return StoreWrapper;
};

export default injectContext;
