const getState = ({ getStore, getActions, setStore }) => {
<<<<<<< HEAD
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
=======
    return {
        store: {
            token: sessionStorage.getItem("auth_token") || null, // Initialize token from sessionStorage
            error: null, // Centralized error handling
            products: [], // Add products to the store
            cart: [], // Items in the cart
        },
        actions: {
            // In appContext.js
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
            
                    // Return the redirect URL for navigation
                    return { success: true, redirectUrl: data.redirect_url };
                } catch (error) {
                    console.error("Login error:", error);
                    setStore({ error: "Network error. Please try again." });
                    return { success: false };
                }
            },
            logout: () => {
                sessionStorage.removeItem("auth_token");
                setStore({ token: null });
            },
            clearError: () => {
                setStore({ error: null });
            },
            // Action to publish a new product
            publishProduct: async (formData) => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "/api/products", {
                  method: 'POST',
                  body: formData,
                });

            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
              const data = await response.json();
              return { success: false, message: data.message || "Failed to publish product." };
            }

            // Return a success message on successful response
            return { success: true, message: "Product created successfully." };
          } catch (error) {
            console.error("Error during API call:", error);
            return { success: false, message: "An error occurred while creating the product." };
          }
        },
        // Action to fetch products
        getProducts: async () => {
          try {
              const response = await fetch(process.env.BACKEND_URL + "/api/products");
              if (!response.ok) throw new Error("Failed to fetch products");
              const data = await response.json();
              setStore({ products: data }); // Update the store with fetched products
          } catch (error) {
              console.error("Error fetching products:", error);
          }
      },
      // Add to cart action
      addToCart: (item) => {
        const store = getStore();
        const updatedCart = [...store.cart, item];
        setStore({ cart: updatedCart });
        console.log("Item added to cart:", item);
    },
    // Remove from cart (optional, for future use)
    removeFromCart: (itemId) => {
      const store = getStore();
      const updatedCart = store.cart.filter(item => item.id !== itemId);
      setStore({ cart: updatedCart });
  },
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.error("Error loading message from backend", error);
                }
            }
        }
    };
>>>>>>> origin/main
};

export default getState;