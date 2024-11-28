const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: sessionStorage.getItem("auth_token") || null, // Initialize token from sessionStorage
            error: null, // Centralized error handling
            menu: [
                { id: "1",
                  title: "Asado con fritas", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiEQ890osGJJyWJMpnez8pfzchfN3c8gr2Uw&s"
                },
                { 
                  id: "2", 
                  title: "Strogonof", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgbNX6ux-vMGoRAgShXxqk_j08gF3bXFEA6A&s"
                },
                { 
                  id: "3", 
                  title: "Pollo con pure", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_iDo5qKKqcdjOWVXJpciiAqWfEL7-NDZpg&s"
                },
                { id: "4", 
                  title: "Canelones", 
                  image: "https://www.clarin.com/2021/06/04/y8kPKKxo5_1200x630__1.jpg"
                },
                { 
                  id: "5", 
                  title: "Pastel de carne", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrK367qwCujJALJf4dnDBWnHLDrfGF74ISfg&s"
                },
                { 
                  id: "6", 
                  title: "Paella", 
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe4bMr-rKcGqbXvrqrZm2a5gPW8oPvxIg8og&s"
                }
            ]
        },
        actions: {
            login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        sessionStorage.setItem("auth_token", data.token);
                        setStore({ token: data.token, error: null });
                        return true;
                    } else {
                        setStore({ error: data.msg || "Login failed!" });
                        return false;
                    }
                } catch (error) {
                    setStore({ error: "An error occurred during login." });
                    return false;
                }
            },
            logout: () => {
                sessionStorage.removeItem("auth_token");
                setStore({ token: null });
            },
            clearError: () => {
                setStore({ error: null });
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