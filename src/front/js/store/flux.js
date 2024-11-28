const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: sessionStorage.getItem("auth_token") || null, // Initialize token from sessionStorage
            error: null, // Centralized error handling
            menu: [
                { id: "1",
                  title: "Poio", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
                },
                { 
                  id: "2", 
                  title: "Milanga", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
                },
                { 
                  id: "3", 
                  title: "Poio", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
                },
                { id: "4", 
                  title: "Milanga", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
                },
                { 
                  id: "5", 
                  title: "Poio", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
                },
                { 
                  id: "6", 
                  title: "Milanga", 
                  image: "https://img.hellofresh.com/w_3840,q_auto,f_auto..." 
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