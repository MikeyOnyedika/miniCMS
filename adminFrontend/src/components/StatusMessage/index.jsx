import React from "react";
import Styles from "./styles.module.css";
import { RequestState } from "../../utils/consts";

function StatusMessage({ status, message }) {

  return (
    <div
      className={`${Styles.Message}   ${status === RequestState.SUCCESS ? Styles.Message___success : Styles.Message___failed
        }`}
    >
      <p>{message}</p>
    </div>
  );
}

export const SUCCESS = "success";
export const FAILED = "failed";

export default StatusMessage;
