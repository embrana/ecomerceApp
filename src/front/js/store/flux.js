const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: sessionStorage.getItem("auth_token") || null, // Initialize token from sessionStorage
            error: null, // Centralized error handling
            products: [], // Add products to the store
            menu: [
                { id: "1",
                  title: "Asado con fritas", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiEQ890osGJJyWJMpnez8pfzchfN3c8gr2Uw&s",
                  description:"Sale asadoooo",
                  categoria:"menu ejecutivo",
                  stock:""
                },
                { 
                  id: "2", 
                  title: "Strogonof", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgbNX6ux-vMGoRAgShXxqk_j08gF3bXFEA6A&s",
                  description:"Strogonof de arroz y pollo",
                  categoria:"menu ejecutivo",
                  stock:""
                },
                { 
                  id: "3", 
                  title: "Pollo con pure", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_iDo5qKKqcdjOWVXJpciiAqWfEL7-NDZpg&s",
                  description:"Pollo a la plancha con pure de calabaza",
                  categoria:"menu ejecutivo",
                  stock:""
                },
                { id: "4", 
                  title: "Canelones", 
                  image: "https://www.clarin.com/2021/06/04/y8kPKKxo5_1200x630__1.jpg",
                  description:"Canelones de verdura con queso parmesano gratinado",
                  categoria:"menu ejecutivo",
                  stock:""
                },
                { 
                  id: "5", 
                  title: "Pastel de carne", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrK367qwCujJALJf4dnDBWnHLDrfGF74ISfg&s",
                  description:"Pastel de carne con guarnicion de ensalada",
                  categoria:"menu ejecutivo",
                  stock:""
                },
                { 
                  id: "6", 
                  title: "Paella", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe4bMr-rKcGqbXvrqrZm2a5gPW8oPvxIg8og&s",
                  description:"Paella de mariscos",
                  categoria:"menu ejecutivo",
                  stock:""
                }
            ],
            bebidas:[{ 
                id: "11", 
                title: "Coca-cola", 
                image: "https://devotouy.vtexassets.com/arquivos/ids/1506940-800-450?v=638619294071130000&width=800&height=450&aspect=true",
                description:"Coca cola 600ml",
                categoria:"bebidas",
                stock:""
              },
              { 
                id: "12", 
                title: "Spriti", 
                image: "https://devotouy.vtexassets.com/arquivos/ids/1506940-800-450?v=638619294071130000&width=800&height=450&aspect=true",
                description:"Coca cola 600ml",
                categoria:"bebidas",
                stock:""
              }
            ]
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
};

export default getState;