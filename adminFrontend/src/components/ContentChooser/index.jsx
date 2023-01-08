import React from "react";
import Styles from "./styles.module.css";
import { Link } from "react-router-dom";
// displays the Category of User content
function ContentChooser() {
  return (
    <div className={Styles.Wrapper}>
      <h2 className={Styles.Heading}>Database Contents</h2>
      <div className={Styles.Group}>
        <Link to="/dashboard/projects" className={Styles.Name}>
          Projects
        </Link>
        {/* ADD ANOTHER LINK IF NEEDED IN FUTURE */}
      </div>
    </div>
  );
}

export default ContentChooser;
