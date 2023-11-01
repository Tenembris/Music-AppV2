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

        // Zapisz w localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("expiresIn", expiresIn);

        window.history.pushState({}, null, "/profile");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error (e.g., redirect to login page)
        // window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeout = setTimeout(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          console.log(res.data);

          const { accessToken, expiresIn } = res.data;

          setAccessToken(accessToken);
          setExpiresIn(expiresIn);

          // Zapisz w localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("expiresIn", expiresIn);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error (e.g., redirect to login page)
          // window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearTimeout(timeout);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
