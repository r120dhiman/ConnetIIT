import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import React, { useEffect } from "react";

export default function Callback() {
  const { CreateEmailPasswordSession } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const handleSession = async () => {
      await CreateEmailPasswordSession();
      navigate('/')
    };

    handleSession();
  }, []); // Empty dependency array ensures it runs only once on mount

  return <div></div>;
}
