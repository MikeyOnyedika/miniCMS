import React from "react";
import Styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { useUserContentContext } from "../../contexts/UserContentProvider";
import { RingLoader } from 'react-spinners'
import StatusMessage, { FAILED, SUCCESS } from "../StatusMessage";

// displays the Category of User content
function ContentChooser() {
  const { collections } = useUserContentContext();

  return (
    <div className={Styles.Wrapper}>
      <h2 className={Styles.Heading}>Database Contents</h2>
      <div className={Styles.Group}>
        {collections.isLoading === true ? (
          <RingLoader
            color={'var(--secondary-clr)'}
            loading={true}
            cssOverride={{ backgroundColor: 'blue' }} />
        ) : collections.isError === true ? (
          <StatusMessage message={collections.errorMsg} status={FAILED} />
        ) : collections.length === 0 ? (
          <div>
            No collections created yet
          </div>
        ) : collections.map((col) => {
          <Link to={`/dashboard/${col.name}`} className={Styles.Name}>
            {col.name}
          </Link>
        })}
      </div>
    </div>
  );
}

export default ContentChooser;
