import React from "react";
import { useEffect } from "react";
import Styles from "./styles.module.css";

function StatusMessage({ status, message, setMessage }) {
  useEffect(() => {
    setTimeout(() => {
      setMessage({ status: "", message: "" });
    }, 2000);
  }, []);

  return (
    <div
      className={`${Styles.Message}   ${
        status === SUCCESS ? Styles.Message___success : Styles.Message___failed
      }`}
    >
      <p>{message}</p>
    </div>
  );
}

export const SUCCESS = "success";
export const FAILED = "failed";

export default StatusMessage;
