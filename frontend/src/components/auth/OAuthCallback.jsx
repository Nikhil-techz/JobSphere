import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function OAuthCallback() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // ==========================================
        // 1. Get JWT from URL
        // ==========================================

        const hash = window.location.hash;

        console.log("OAuth callback hash:", hash);

        const params = new URLSearchParams(hash.substring(1));

        const accessToken = params.get("access_token");

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        console.log("Google access token received");

        // ==========================================
        // 2. Store JWT
        // ==========================================

        localStorage.setItem("access_token", accessToken);

        console.log(
          "JWT stored:",
          Boolean(localStorage.getItem("access_token"))
        );

        // ==========================================
        // 3. Remove JWT from browser URL
        // ==========================================

        window.history.replaceState({}, document.title, "/oauth/callback");

        // ==========================================
        // 4. Load authenticated user
        // ==========================================

        const loggedInUser = await loadUser();

        console.log("Google OAuth user:", loggedInUser);

        // ==========================================
        // 5. Make sure user was loaded
        // ==========================================

        if (!loggedInUser) {
          throw new Error("Unable to load authenticated user");
        }

        // ==========================================
        // 6. Redirect based on role
        // ==========================================

        const role = String(loggedInUser.role).toLowerCase();

        console.log("Authenticated user role:", role);

        if (role === "applicant") {
          navigate("/applicant/dashboard", {
            replace: true,
          });

          return;
        }

        if (role === "recruiter") {
          navigate("/recruiter/dashboard", {
            replace: true,
          });

          return;
        }

        // Unknown role
        console.error("Unknown user role:", loggedInUser.role);

        navigate("/", {
          replace: true,
        });
      } catch (error) {
        console.error("Google OAuth failed:", error);

        // Remove invalid token
        localStorage.removeItem("access_token");

        navigate("/login", {
          replace: true,
        });
      }
    };

    handleOAuthCallback();
  }, [navigate, loadUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Signing you in...
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we complete Google authentication.
        </p>
      </div>
    </div>
  );
}

export default OAuthCallback;
