const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

/**
 * Common fetch wrapper to handle headers and credentials
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${BACKEND_URL}${endpoint}`;

    // Default headers
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
        credentials: "include", // IMPORTANT: Maintain cookies
    };

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized (session expired or invalid)
        if (response.status === 401) {
            // Optional: Dispatch a custom event or let the caller handle it.
            // For now, we will throw an error that the UI can catch.
            // If we had a global store, we might logout here.
            // window.location.href = "/login"; // Brute force redirect if needed
        }

        // Parse JSON if possible
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.detail || data?.message || "Something went wrong",
                data
            };
        }

        return data;
    } catch (error) {
        // Network errors or other issues
        throw error;
    }
}

// --- Auth APIs ---

export async function registerUser(userData) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export async function loginUser(credentials) {
    // credentials: { email, password }
    // No token returned, just HttpOnly cookie set by server
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

export async function logoutUser() {
    return apiFetch("/auth/logout", {
        method: "POST",
    });
}

export async function getCurrentUser() {
    return apiFetch("/auth/me", {
        method: "GET",
    });
}

// --- Analysis APIs ---

export async function analyzeText(text) {
    return apiFetch("/analyze/", {
        method: "POST",
        body: JSON.stringify({ text }),
    });
}

export async function getHistory() {
    return apiFetch("/history/", {
        method: "GET",
    });
}

export async function getHistoryById(id) {
    return apiFetch(`/history/${id}`, {
        method: "GET",
    });
}
