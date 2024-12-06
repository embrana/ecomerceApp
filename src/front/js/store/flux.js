const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: sessionStorage.getItem("auth_token") || null,
            error: null,
            products: [],
            cart: [],
            orders: [],  // Add orders to the store
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

            // Login action
            login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
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
                    sessionStorage.setItem("auth_token", data.token); // Store token in sessionStorage
                    setStore({ token: data.token, error: null });

                    return { success: true, redirectUrl: data.redirect_url };
                } catch (error) {
                    console.error("Login error:", error);
                    setStore({ error: "Network error. Please try again." });
                    return { success: false };
                }
            },

            // Get orders
            getOrders: async () => {
                try {
                    const data = await getActions().apiCall(process.env.BACKEND_URL + "/api/orders");  // Adjust API URL
                    // If successful, update the store with the fetched orders
                    if (data && Array.isArray(data.orders)) {
                        setStore({ orders: data.orders });
                    } else {
                        console.error("Unexpected response format:", data);
                        setStore({ orders: [] });
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setStore({ orders: [] });
                }
            },

            // Fetch products (already in your code)
            getProducts: async () => {
                try {
                    const data = await getActions().apiCall(process.env.BACKEND_URL + "/api/products");

                    if (data && Array.isArray(data.products)) {
                        setStore({ products: data.products });
                    } else {
                        console.error("Unexpected response format:", data);
                        setStore({ products: [] });
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                    setStore({ products: [] });
                }
            },

            // Add item to cart (already in your code)
            addToCart: (item) => {
                const store = getStore();
                const updatedCart = [...store.cart, item];
                setStore({ cart: updatedCart });
                console.log("Item added to cart:", item);
            },

            // Remove item from cart (already in your code)
            removeFromCart: (itemId) => {
                const store = getStore();
                const updatedCart = store.cart.filter(item => item.id !== itemId);
                setStore({ cart: updatedCart });
            },

            // Fetch a welcome message (already in your code)
            getMessage: async () => {
                try {
                    const data = await getActions().apiCall(process.env.BACKEND_URL + "/api/hello");
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
