const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: null, // Add token to the store
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
            // Example function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Get message from backend
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            // Change color for demo array
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            // Login action to handle user login and set the token in the store
            login: async (email, password) => {
				const payload = { email, password };
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(payload)
					});
					const data = await response.json();
					console.log(data);
			
					if (response.ok) {
						// On success, store the JWT token in Flux store
						setStore({ token: data.token });
			
						// Store the token in sessionStorage for persistence across page reloads
						sessionStorage.setItem('auth_token', data.token);
						
						return true; // Return true for successful login
					} else {
						console.error(data.msg || "Login failed!");
						setStore({ error: data.msg || "Login failed!" }); // Store the error message
						return false; // Return false for failed login
					}
				} catch (error) {
					console.error("An error occurred:", error);
					setStore({ error: "An error occurred during login." }); // Store the error message
					return false; // Return false for failed login
				}
			},
			logout: () => {
                // Clear token from store
                setStore({ token: null });
                // Remove token from sessionStorage
                sessionStorage.removeItem("auth_token");
            }
			
        }
    };
};

export default getState;
