import React from "react";

const sendForm = (props) => {
  const handleSubmit = (e) => {
    let name = props.name;
    let email = props.email;
    let message = props.message;

    console.log("Sending");
    let data = {
      name,
      email,
      message,
    };
    try {
      fetch("http://localhost:5000/send", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.log(err);
    }
  };
};
