import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [token, setToken] = useState("");
  const getParamsFromHash = (hash) => {
    const hashContent = hash.substring(1);
    const paramsInUrl = hashContent.split("&");
    let params = {};
    let values = [];
    paramsInUrl.forEach((param) => {
      values = param.split("=");
      params[values[0]] = values[1];
    });
    return params;
  };

  useEffect(() => {
    setToken(localStorage.getItem("tokens"));
  }, [token]);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      const tokens = getParamsFromHash(hash);
      localStorage.setItem("tokens", tokens.access_token);
      setToken(tokens.access_token);
      window.history.pushState({}, null, "/profile");
    }
  }, []);
  return <div>{token && <h2>Token: {token}</h2>}</div>;
};

export default ProfilePage;
