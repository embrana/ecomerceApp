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

        logout: () => {
            // Clear the token from sessionStorage
            sessionStorage.removeItem("auth_token");

            // Reset the store values
            setStore({
                token: null,
                cart: [],
                orders: [],
                products: [],
                error: null,
            });

            console.log("User logged out.");
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

   
            // Publish a new product
            publishProduct: async (formData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/products", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${getStore().token}`,
                        },
                        body: formData, // FormData object
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
              setOrder: async (cart) => {
                try {

                    const token = getStore().token;
                    if (!token) {
                        console.error("Token not found. Please log in.");
                        return { success: false, message: "User token not available." };
                    }

                    const response = await fetch(process.env.BACKEND_URL + "/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" , 
                                    "Authorization": `Bearer ${getStore().token}`
                                },
                        body: JSON.stringify({
                            cart:cart,
                            user_id: 1, 
                        }),
                    });
                    console.log("Item added to cart:", cart);
   
                    if (!response.ok) {
                        const data = await response.json();
                        return { success: false, message: data.message || "Failed to publish ORDER." };
                    }
   
                    return { success: true, message: "ORDER created successfully." };
                } catch (error) {
                    console.error("Error during API call:", error);
                    return { success: false, message: "An error occurred while creating the ORDER." };
                }
            },
            getProducts: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/products");
                    if (!response.ok) throw new Error("Failed to fetch products");
                    
                    const data = await response.json();
                    
                    // Check if the response contains a 'products' property which is an array
                    if (Array.isArray(data.products)) {
                        setStore({ products: data.products }); // Store the products array
                    } else {
                        console.error("Unexpected response format for products:", data);
                        setStore({ products: [] }); // Fallback to empty array if the format is not correct
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },
            addToCart: (item) => {
                const store = getStore();
                const updatedCart = [...store.cart, item];
                setStore({ cart: updatedCart });
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                console.log("Item added to cart:", item);
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