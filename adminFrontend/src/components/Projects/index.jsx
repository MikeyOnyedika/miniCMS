import React, { useState } from "react";
import { useUserContentContext } from "../../contexts/UserContentProvider";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import Styles from "./styles.module.css";
import { FAILED, SUCCESS } from "../StatusMessage";

function Projects() {
  const {
    projects,
    deleteProject,
    reloadProjects,
    setOpenModal,
    setCurrentProject,
    deleteProjectFromList,
    setStatusMessage,
  } = useUserContentContext();
  const navigate = useNavigate();

  async function handleDelete(id) {
    const data = await deleteProject(id);
    if (data.success) {
      deleteProjectFromList(id);
      setStatusMessage({
        status: SUCCESS,
        message: "Project deleted Successfully!",
      });
    } else {
      setStatusMessage({ status: FAILED, message: data.message });
    }
  }

  return (
    <div className={Styles.Wrapper}>
      <div className={Styles.Heading}>
        <Link to="/dashboard">
          <FaArrowLeft />
        </Link>
        <h2 className={Styles.Title}>Projects</h2>
      </div>
      <button
        className={Styles.BackBtn}
        onClick={() => {
          setOpenModal({ open: true, mode: "create" });
          navigate("/dashboard/projects/new");
        }}
      >
        <FaPlus /> Add a Project
      </button>

      <div className={Styles.TableWrapper}>
        {projects.length === 0 && <p>No projects Added yet</p>}
        {projects && (
          <table className={Styles.Table}>
            <thead></thead>
            <tbody>
              <>
                {projects.map((project) => (
                  <React.Fragment key={project.id}>
                    <tr>
                      <td className={`${Styles.Td} ${Styles.Td___lg}`}>
                        <div>
                          <article>
                            <h3>
                              <span className={Styles.ProjectInfoType}>
                                <p>Name: </p>
                              </span>
                              {project.name}
                            </h3>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Description: </p>
                              </span>
                              {project.desc}
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Picture: </p>
                              </span>
                              <a href={project.image} target="_blank">
                                {project.image}
                              </a>
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>URL:</p>
                              </span>
                              <a href={project.link} target="_blank">
                                {project.link}
                              </a>
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Icon 1:</p>
                              </span>
                              {project.icon1}
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Icon2:</p>
                              </span>
                              {project.icon2}
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Icon 3:</p>
                              </span>
                              {project.icon3}
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Type:</p>
                              </span>
                              {project.type}
                            </div>
                            <div>
                              <span className={Styles.ProjectInfoType}>
                                <p>Featured:</p>
                              </span>
                              {project.featured === true ? "True" : "False"}
                            </div>
                          </article>
                        </div>
                      </td>
                      <td className={Styles.Td}>
                        <div>
                          <button
                            onClick={() => {
                              setCurrentProject(project);
                              setOpenModal({ open: true, mode: "edit" });
                              navigate("/dashboard/projects/edit");
                            }}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                      <td className={Styles.Td}>
                        <div>
                          <button onClick={() => handleDelete(project.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Projects;
