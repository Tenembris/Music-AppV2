import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expiresIn"));

  useEffect(() => {
    if (!code) return;
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        console.log(res.data);

        const { accessToken, refreshToken, expiresIn } = res.data;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        // Save to localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("expiresIn", expiresIn);

        window.history.pushState({}, null, "/profile");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [code]);

  // Function to check token validity
  const checkTokenValidity = async () => {
    try {
      await axios.get("http://localhost:3001/protected-resource", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(true); // Token is valid
    } catch (error) {
      console.error("Token validation error:", error);
      console.log(false); // Token is valid // Token is invalid
    }
  };

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeout = setTimeout(async () => {
      const isTokenValid = await checkTokenValidity();
      if (isTokenValid) {
        // Token is still valid, refresh it
        axios
          .post("http://localhost:3001/refresh", {
            refreshToken,
          })
          .then((res) => {
            console.log(res.data);

            const { accessToken, expiresIn } = res.data;

            setAccessToken(accessToken);
            setExpiresIn(expiresIn);

            // Save to localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("expiresIn", expiresIn);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        // Token is no longer valid, handle as needed (e.g., redirect to login)
      }
    }, (expiresIn - 60) * 1000);

    return () => clearTimeout(timeout);
  }, [refreshToken, expiresIn, accessToken]);

  return accessToken;
}
