import axios from "axios";

/* Auth failures were all reported as bad credentials, so an unreachable or broken
   backend told users their password was wrong (and on signup, that their email was
   taken). Separate the cases the user can act on from the ones they can't. */
export const authErrorMessage = (err: unknown, credentials: string): string => {
    if (axios.isAxiosError(err)) {
        // no response at all: DNS, TLS, timeout, server down, connection refused
        if (!err.response) {
            return err.code === "ECONNABORTED" || err.code === "ETIMEDOUT"
                ? "The server took too long to respond. Please try again."
                : "Can't reach the server right now. Please try again shortly.";
        }

        const status = err.response.status;
        if (status >= 500) return "The server hit an error. Please try again shortly.";
        if (status === 429) return "Too many attempts. Please wait a moment and try again.";
    }

    // 4xx, or something that isn't an axios error at all
    return credentials;
};
