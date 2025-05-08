import io from "socket.io-client";

// Asegúrate de que BACKEND_URL termine con una barra
export const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:3001").endsWith('/') 
    ? (process.env.BACKEND_URL || "http://localhost:3001") 
    : (process.env.BACKEND_URL || "http://localhost:3001") + "/";

// Evitamos inicializar socket múltiples veces con una variable para controlarlo
let socketInitialized = false;

if (!window.socket && !socketInitialized) {
    console.log("🟢 Initializing SocketIO...");
    socketInitialized = true;
    // Eliminamos la barra final si existe para el socket.io
    const socketUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    window.socket = io(socketUrl);

    window.socket.on("connect", () => {
        console.log("✅ SocketIO connected successfully!");
    });

    window.socket.on("disconnect", () => {
        console.warn("⚠️ SocketIO disconnected.");
        // Reseteamos el estado para permitir reconexión
        socketInitialized = false;
    });
} else {
    console.log("ℹ️ SocketIO already initialized.");
}


const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: sessionStorage.getItem("auth_token") || null,
            user_type: sessionStorage.getItem("user_type") || null,
            is_waiter: sessionStorage.getItem("is_waiter") === "true" || false,
            is_admin: sessionStorage.getItem("is_admin") === "true" || false,
            user_info: JSON.parse(sessionStorage.getItem("user_info") || "null"),
            error: null,
            products: [],
            cart: [],
            orders: [],
            order_data: [],
            reservas: JSON.parse(localStorage.getItem("reservas")) || [],  // Initialize reservas from localStorage or empty array
        },
        actions: {

            // Utility function to make API calls with common headers
            apiCall: async (url, options = {}) => {
                const token = getStore().token;
                const headers = {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                };

                const response = await fetch(url, { ...options, headers });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || "Unknown error");
                }
                return response.json();
            },

            // Consolidate cart items to remove duplicates and sum quantities
            consolidateCart: (cart) => {
                return cart.reduce((acc, item) => {
                    const existing = acc.find(i => i.product_id === item.product_id);
                    if (existing) {
                        existing.quantity += item.quantity;
                    } else {
                        acc.push({ ...item });
                    }
                    return acc;
                }, []);
            },

            // Login action
            login: async (email, password) => {
                try {
                    const response = await fetch(BACKEND_URL + "api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        setStore({ error: errorData.msg });
                        return { success: false };
                    }
            
                    const data = await response.json();
            
                    // Store the token and user type in sessionStorage
                    sessionStorage.setItem("auth_token", data.token);
                    sessionStorage.setItem("user_type", data.user_type);
                    sessionStorage.setItem("is_waiter", data.is_waiter || false);
                    sessionStorage.setItem("is_admin", data.is_admin || false);
                    
                    if (data.user_info) {
                        sessionStorage.setItem("user_info", JSON.stringify(data.user_info));
                    }
            
                    // Update the store with token and user_type
                    setStore({
                        token: data.token,
                        user_type: data.user_type,
                        is_waiter: data.is_waiter || false,
                        is_admin: data.is_admin || false,
                        user_info: data.user_info || null,
                        error: null, 
                    });
            
                    console.log("Session storage updated and state set.");
                   
            
                    // Return success and the URL to redirect to
                    return { success: true, redirectUrl: data.redirect_url };
                } catch (error) {
                    console.error("Login error:", error);
                    setStore({ error: "Network error. Please try again." });
                    return { success: false };
                }
            },
            

            logout: () => {
                sessionStorage.removeItem("auth_token");
                sessionStorage.removeItem("user_type");
                sessionStorage.removeItem("is_waiter");
                sessionStorage.removeItem("is_admin");
                sessionStorage.removeItem("user_info");
                setStore({
                    token: null,
                    user_type: null,
                    is_waiter: false,
                    is_admin: false,
                    user_info: null,
                    cart: [],
                    orders: [],
                    products: [],
                    error: null,
                });
                console.log("User logged out.");
            },

            // Fetch orders
            getOrders: async () => {
                // Evitamos peticiones HTTP innecesarias
                const store = getStore();
                if (store.orders && store.orders.length > 0) {
                    console.log("Using cached orders, length:", store.orders.length);
                    return;
                }
                
                try {
                    console.log("Fetching orders from server...");
                    const data = await getActions().apiCall(BACKEND_URL + "api/orders");
                    if (data && Array.isArray(data.orders)) {
                        setStore({ orders: data.orders });
                        console.log("Orders fetched successfully:", data.orders.length);
                    } else {
                        console.error("Unexpected response format:", data);
                        setStore({ orders: [] });
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setStore({ orders: [] });
                }
            },

            // // Escucha actualizaciones en tiempo real usando SocketIO
            // listenOrders: () => {
            //     console.log("Checking if socket is initialized:", window.socket);
            //     if (!window.socket) {
            //         console.error("SocketIO not initialized. Ensure socket is connected.");
            //         return;
            //     }
            
            //     console.log("🛠️ Listening for 'new_order' events...");
            //     window.socket.on('new_order', (order) => {
            //         console.log("🔔 New order received from server:", order);
            //         // getActions().updateOrderInStore(order);

            
            //         // Verificamos si 'order' tiene los datos esperados
            //         if (!order || typeof order !== "object") {
            //             console.error("⚠️ Invalid order format received:", order);
            //             return;
            //         }
            
            //         // Actualizamos el store
            //         console.log("ACA ES LISTEN ORDERSS. Updating store with the new order...///--->", order);
            //         getActions().updateOrderInStore(order);
            //     });
            // },
            // Escucha actualizaciones en tiempo real usando SocketIO
            // listenOrders: () => {
            //     console.log("Checking if socket is initialized:", window.socket);
            //     if (!window.socket) {
            //         console.error("SocketIO not initialized. Ensure socket is connected.");
            //         return;
            //     }

            //     console.log("🛠️ Listening for 'new_order' events...");
            //     window.socket.on('new_order', (order) => {
            //         console.log("🔔 New order received from server:", order);

            //         // Verificamos si 'order' tiene los datos esperados
            //         if (!order || typeof order !== "object") {
            //             console.error("⚠️ Invalid order format received:", order);
            //             return;
            //         }

            //         console.log("🔔 🔔 🔔 Available actions in listenOrders:", getActions());
            //         console.log("Checking if getActions().updateOrderInStore exists...");
            //         const actions = getActions();

            //         if (actions && typeof actions.updateOrderInStore === "function") {
            //             console.log("Calling updateOrderInStore...");
            //             actions.updateOrderInStore(order);
            //         } else {
            //             console.error("updateOrderInStore function not found in getActions.");
            //         }
            //     });
            // },

            // Esta función ya no se usa desde el componente, eliminada para evitar múltiples listeners
            listenOrders: () => {
                console.log("listenOrders is deprecated - socket listening should be done in the component");
            },
            


            // Actualiza las órdenes en el store
            // updateOrderInStore: (order) => {
            //     const store = getStore();
            //     const updatedOrders = store.orders.map((order) =>
            //         order.id === updatedOrder.id ? updatedOrder : order
            //     );
            //     updatedOrders = [...store.orders, order]; // Agregar la nueva orden
            //     console.log("✅ Updated orders:", updatedOrders);
            //     // setStore({ orders: updatedOrders });
            //     setStore({ ...store, orders: updatedOrders }); // Actualizar el store
            //     console.log("ACA ES UPDATED ORDERS Store updated with new order------------>:", updatedOrders);
            // },
            // updateOrderInStore: (order) => {
            //     const store = getStore();
            //     const updatedOrders = store.orders.map((existingOrder) =>
            //         existingOrder.order_number === order.order_number ? order : existingOrder
            //     );
            
            //     // Si no encontramos el ID, lo agregamos
            //     if (!updatedOrders.find(o => o.order_number === order.order_number)) {
            //         updatedOrders.push(order);
            //     }
            
            //     setStore({ ...store, orders: updatedOrders });
            //     console.log("✅ Store updated with new order:--------> ACA UPDATED ORDER", updatedOrders);
            // },
            ////////////////////////////////////////
            // updateOrderInStore: (order) => {
            //     console.log("📥 Inside updateOrderInStore. Order received:", order);
            //     console.log("EN UPDARTED ORDER IN STORE FUNCTION")
            //     // console.log("Inside updateOrderInStore. Order to update:", order);
            //     try {
            //         const store = getStore();
                    
            //         // Validar el estado actual del store y la estructura de orders
            //         if (!Array.isArray(store.orders)) {
            //             console.error("⚠️ Store.orders is not an array. Initializing as empty array.");
            //             setStore({ ...store, orders: [] });
            //             return;
            //         }

            //         console.log("Current Orders in Store:", store.orders);
            
            //         // Mapear las órdenes existentes para actualizar el order si el order_number coincide
            //         const updatedOrders = store.orders.map((existingOrder) =>
            //             existingOrder.order_number === order.order_number ? order : existingOrder
            //         );
            
            //         // Si no encontramos el ID, lo agregamos al array
            //         if (!updatedOrders.find(o => o.order_number === order.order_number)) {
            //             console.log("🆕 Order not found. Adding new order to the store.");
            //             updatedOrders.push(order);
            //         }
            
            
            //         console.log("Updating Store with the new order...");
            //         setStore({ ...store, orders: updatedOrders });
            //         console.log("Current state of orders:", getStore().orders);
            
            //         console.log("✅ Store updated successfully. New state of orders:", getStore().orders);
            //     } catch (error) {
            //         console.error("❌ Failed to update order in store:", error);
            //     }
            // },

            // updateOrderInStore: (order) => {
            //     console.log("📥 Inside updateOrderInStore. Order received:", order);
            //     try {
            //         const store = getStore();
            
            //         // Validar el estado actual del store y la estructura de orders
            //         if (!Array.isArray(store.orders)) {
            //             console.error("⚠️ Store.orders is not an array. Initializing as empty array.");
            //             setStore({ ...store, orders: [] });
            //             return;
            //         }
            
            //         console.log("Current Orders in Store:", store.orders);
            
            //         // Actualizar la orden existente o agregarla si es nueva
            //         const updatedOrders = store.orders.map((existingOrder) =>
            //             existingOrder.order_number === order.order_number ? order : existingOrder
            //         );
            
            //         if (!updatedOrders.find(o => o.order_number === order.order_number)) {
            //             console.log("🆕 Order not found. Adding new order to the store.");
            //             updatedOrders.push(order);
            //         }
            
            //         console.log("Updating Store with the new orders array...");
            
            //         // Garantizar que se cree un nuevo objeto en el store para forzar re-render
            //         setStore({ ...store, orders: [...updatedOrders] });
            
            //         console.log("✅ Store updated successfully. New state of orders:", getStore().orders);
            //     } catch (error) {
            //         console.error("❌ Failed to update order in store:", error);
            //     }
            // },

            // updateOrderInStore: (order) => {
            //     try {
            //         const store = getStore();
            
            //         if (!Array.isArray(store.orders)) {
            //             console.error("⚠️ Store.orders is not an array. Initializing as empty array.");
            //             setStore({ ...store, orders: [] });
            //             return;
            //         }
            
            //         console.log("Current Orders in Store:", store.orders);
            
            //         // Actualizar la orden, garantizando una nueva referencia en el array
            //         const updatedOrders = store.orders.map(existingOrder =>
            //             existingOrder.order_number === order.order_number ? order : existingOrder
            //         );
            
            //         // Si no existe, agregar la nueva orden
            //         if (!updatedOrders.find(o => o.order_number === order.order_number)) {
            //             updatedOrders.push(order);
            //         }
            
            //         console.log("Updating Store with a new orders array...");
            //         setStore({
            //             ...store,
            //             orders: [...updatedOrders]  // Fuerza una nueva referencia
            //         });
            
            //         console.log("✅ Store updated with new order:", updatedOrders);
            //     } catch (error) {
            //         console.error("Failed to update order in store:", error);
            //     }
            // },
            
            updateOrderInStore: (order) => {
                try {
                    const store = getStore();
            
                    if (!Array.isArray(store.orders)) {
                        console.error("⚠️ Store.orders is not an array. Initializing as an empty array.");
                        setStore({ ...store, orders: [] });
                        return;
                    }
            
                    console.log("Current Orders in Store:", store.orders.length);
            
                    // Encuentra si la orden ya existe
                    const orderExists = store.orders.some(existingOrder => 
                        existingOrder.order_number === order.order_number
                    );
                    
                    let updatedOrders;
                    
                    if (orderExists) {
                        // Actualiza la orden existente
                        updatedOrders = store.orders.map(existingOrder => 
                            existingOrder.order_number === order.order_number 
                                ? {...order} 
                                : existingOrder
                        );
                        console.log("Updating existing order");
                    } else {
                        // Agrega nueva orden al inicio para que aparezca primero
                        updatedOrders = [{...order}, ...store.orders];
                        console.log("Adding new order");
                    }
            
                    // Solo actualizamos si hay cambios
                    if (orderExists || updatedOrders.length !== store.orders.length) {
                        console.log("Updating Store with a new orders array...");
                        setStore({
                            ...store,
                            orders: updatedOrders
                        });
                        console.log("✅ Store updated with order:", order.order_number);
                    }
                } catch (error) {
                    console.error("❌ Failed to update order in store:", error);
                }
            },
                        

            // Publish a new product
            publishProduct: async (formData) => {
                try {
                    const response = await fetch(BACKEND_URL + "api/products", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${getStore().token}`,
                        },
                        body: formData,
                      
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        return { success: false, message: data.message || "Failed to publish product." };
                    }

                    return { success: true, message: "Product created successfully." };
                } catch (error) {
                    console.error("Error during API call:", error);
                    return { success: false, message: "An error occurred while creating the product." };
                }
            },

            toggleProductActive: async (productId) => {
                const store = getStore(); // Obtiene el store actual
                try {
                    // Realiza una solicitud PATCH al endpoint
                    const response = await fetch(`${BACKEND_URL}api/product/toggle_active/${productId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            
                    // Verifica si la solicitud fue exitosa
                    if (response.ok) {
                        const data = await response.json();
            
                        // Actualiza el estado del producto en la lista
                        const updatedProducts = store.products.map((product) => {
                            if (product.id === productId) {
                                return { ...product, is_active: !product.is_active }; // Invierte is_active
                            }
                            return product;
                        });
                        setStore({ products: updatedProducts });
            
                        return true; // Indica éxito
                    } else {
                        const errorText = await response.text(); // Maneja errores del servidor
                        console.error(`Error: ${errorText}`);
                        return false; // Indica fallo
                    }
                } catch (error) {
                    console.error("Error while toggling product active status:", error);
                    return false; // Indica fallo
                }
            },
            
            setOrder: async () => {
                const store = getStore();
                const actions = getActions();
            
                const consolidatedCart = actions.consolidateCart(store.cart);
            
                try {
                    const token = store.token;
                    if (!token) {
                        console.error("Token not found. Please log in.");
                        return { success: false, message: "User token not available." };
                    }
            
                    const response = await fetch(`${BACKEND_URL}api/orders`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ cart: consolidatedCart }),
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("API Error:", errorData);
                        return { success: false, message: errorData.msg || "Failed to create order." };
                    }
            
                    const data = await response.json();
            
                    // Save the detailed order data in the store
                    setStore({ order_data: data, cart: [] });
                    localStorage.removeItem("cart");
            
                    return { success: true, message: "Order created successfully.", order: data };
                } catch (error) {
                    console.error("Error during API call:", error);
                    return { success: false, message: "An error occurred while creating the order." };
                }
            },
            // Esta función se mantiene para compatibilidad con actualizaciones de órdenes por ID
            // pero no se usa para los websockets
            updateOrderById: (updatedOrder) => {
                const store = getStore();
                const updatedOrders = store.orders.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order
                );
                setStore({ orders: updatedOrders });
            },

            getProducts: async () => {
                // Evitamos peticiones HTTP innecesarias
                const store = getStore();
                if (store.products && store.products.length > 0) {
                    console.log("Using cached products, length:", store.products.length);
                    return;
                }
                
                try {
                    console.log("Fetching products from server...");
                    const response = await fetch(BACKEND_URL + "api/products");
                    if (!response.ok) throw new Error("Failed to fetch products");

                    const data = await response.json();
                    if (Array.isArray(data.products)) {
                        setStore({ products: data.products });
                        console.log("Products fetched successfully:", data.products.length);
                    } else {
                        console.error("Unexpected response format for products:", data);
                        setStore({ products: [] });
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },

            addToCart: (product) => {
                const store = getStore();
                const existingItem = store.cart.find(item => item.product_id === product.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    store.cart.push({
                        product_id: product.id,
                        quantity: 1,
                        name: product.name,
                        price: product.price,
                    });
                }
                const updatedCart = [...store.cart];
                setStore({ cart: updatedCart });
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            },
            // Función para actualizar el carrito
            setCart: updatedCart => {
                setStore({ cart: updatedCart });
            },

            initializeCart: () => {
                const savedCart = localStorage.getItem("cart");
                if (savedCart) {
                    setStore({ cart: JSON.parse(savedCart) });
                }
            },

            removeFromCart: (index) => {
                const store = getStore();
                const updatedCart = store.cart.filter((_, i) => i !== index);
                setStore({ cart: updatedCart });
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            },

            setReservas: (newReservas) => {
                setStore({ reservas: newReservas });
                localStorage.setItem("reservas", JSON.stringify(newReservas));
            },

            fetchReservas: async () => {
                try {
                  const data = await getActions().apiCall(BACKEND_URL + "api/reserve");
                  console.log("Fetched reservas:", data); // Debug log
                  if (data && data.Reserve) {
                    setStore({ reservas: data.Reserve }); // Update store with data.Reserve
                    localStorage.setItem("reservas", JSON.stringify(data.Reserve)); // Sync with localStorage
                  } else {
                    setStore({ reservas: [] }); // If data is empty or undefined, use an empty array
                  }
                } catch (error) {
                  console.error("Error fetching reservas:", error);
                  setStore({ reservas: [] }); // Fallback to empty array in case of an error
                }
              },
              
            // Add a new reserva
            addReserva: async (nuevaReserva) => {
                try {
                    const data = await getActions().apiCall(
                        BACKEND_URL + "api/reserve",
                        {
                            method: "POST",
                            body: JSON.stringify(nuevaReserva),
                        }
                    );
                    setStore({ reservas: [...getStore().reservas, data.Reserve] });
                } catch (error) {
                    console.error("Error adding reserva:", error);
                }
            },

            deleteReserva: async (id) => {
                const store = getStore();
                try {
                    // Send DELETE request to backend API
                    const response = await fetch(BACKEND_URL + `api/reserve/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${store.token}`, // Include token if needed
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to delete reserva from backend");
                    }

                    // If successful, update the store and localStorage
                    const updatedReservas = store.reservas.filter((reserva) => reserva.id !== id);
                    setStore({ reservas: updatedReservas });
                    localStorage.setItem("reservas", JSON.stringify(updatedReservas));
                    console.log("Reserva deleted:", id);
                } catch (error) {
                    console.error("Error deleting reserva:", error);
                }
            },
            
                
            
            getMessage: async () => {
                try {
                    const data = await getActions().apiCall(BACKEND_URL + "api/hello");
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.error("Error loading message from backend", error);
                }
            },
        },
    };
};

export default getState;
