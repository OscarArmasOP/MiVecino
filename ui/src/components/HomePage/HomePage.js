import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getUsers } from "../../services/userServices";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (window.localStorage.getItem("user")) {
      getUsers()
        .then((response) => {
          setUsers(response);
        })
        .catch((e) => setLocation("/login"));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  return (
    <div>
      <h1>HOME PAGE</h1>
      {users.map((user) => (
        <h2>{user.username}</h2>
      ))}
    </div>
  );
};

export default HomePage;
