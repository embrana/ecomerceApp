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

        useEffect(() => {
            /**
             * Ejecutar acciones al cargar la aplicación
             */
            state.actions.initializeCart();
            state.actions.getMessage();
            
        }, []);

        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    return StoreWrapper;
};

export default injectContext;
