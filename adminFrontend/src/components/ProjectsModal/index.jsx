import React, { useState } from "react";
import Styles from "./styles.module.css";
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";
import capitalize from "../../utils/capitalize";
import { useUserContentContext } from "../../contexts/UserContentProvider";
import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom ";
import { SUCCESS, FAILED } from "../StatusMessage";
import { FaArrowLeft } from "react-icons/fa";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";

//ProjectModal can be opened either in the "create" mode or in the "edit" mode
function ProjectsModal() {
  const submitBtnRef = useRef();
  const [isAFileAccepted, setIsAFileAccepted] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg"
      ) {
        inputRef.current.value = "";
        setIsAFileAccepted(false);
        setStatusMessage({
          status: FAILED,
          message: "Image should be an image file",
        });
      } else {
        setIsAFileAccepted(true);
      }
    });
  }, []);

  const [imageUploadChoice, setImageUploadChoice] = useState();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, inputRef } =
    useDropzone({ onDrop });

  const dateRef = useRef();
  const {
    currentProject: project,
    addProject,
    updateProject,
    setOpenModal,
    openModal,
    setStatusMessage,
    uploadToCdn,
    includeProjectToList,
    updateProjectInList,
  } = useUserContentContext();
  const { id, name, desc, image, link, icon1, icon2, icon3, type, featured } =
    project;
  const { mode } = openModal;
  const navigate = useNavigate();

  function closeModal() {
    setOpenModal({ mode: null, open: false });
    navigate("/dashboard/projects");
  }

  const formDataInitialState = {
    name: "",
    desc: "",
    image: "",
    link: "",
    icon1: "",
    icon2: "",
    icon3: "",
    type: "",
    featured: false,
  };

  const [formData, setFormData] = useState(formDataInitialState);

  //   pre-populate form with info of the current selected project if admin will be editing the project info
  useEffect(() => {
    if (mode === "edit") {
      setFormData({
        name,
        desc,
        image,
        link,
        icon1,
        icon2,
        icon3,
        type,
        featured,
      });
    }

    // dateRef.current.max = new Date().toLocaleDateString("en-ca");
  }, []);

  function handleChange(e) {
    let newValue = e.target.value;
    if (e.target.id === "featured") {
      newValue = e.target.checked;
    }

    setFormData((prevValue) => {
      return { ...prevValue, [e.target.id]: newValue };
    });
  }

  function setSubmitBtnEnabled(isEnabled) {
    submitBtnRef.current.disabled = isEnabled;
    setProcessingRequest(isEnabled);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // loop through all properties of formData which corresponds to the value for each form input
    for (let field in formData) {
      const element = e.target[field];

      const elementName = capitalize(element.id);

      // check if user has provided a value to the form input or not
      if (element.value === "") {
        // check whether the acceptedFiles array has something in it, in the case of the image. This will be the case if user decides to upload image
        if (element.id === "image") {
          if (acceptedFiles.length === 0) {
            setStatusMessage({
              status: FAILED,
              message: elementName + " field should not be empty!",
            });
            element.focus();
            return;
          }
        } else {
          setStatusMessage({
            status: FAILED,
            message: elementName + " field should not be empty!",
          });
          element.focus();
          return;
        }
      }
    }

    let imageUrl = formData.image;

    // You want to  disable submit button to prevent user from clicking multiple times
    setSubmitBtnEnabled(false);

    // generate a project id if we're adding a new project or use project id of current project if we're only editing the project
    const imageProjectId = mode === "create" ? generateId() : id;
    if (imageUploadChoice === "upload") {
      // first upload the image to the cdn server

      const imageUploadResponse = await uploadToCdn(
        acceptedFiles[0],
        imageProjectId
      );
      // if that works, then use the url returned to set the imageUrl for the project we'll be creating
      if (imageUploadResponse.success) {
        imageUrl = imageUploadResponse.url;
      } else {
        imageUrl = "";
      }
    }

    // if after everything the imageUrl remains an empty string, it means uploading the image to the server didn't go through, so we don't try to create the new project
    if (imageUrl === "") {
      setStatusMessage({
        status: FAILED,
        message:
          "Project Image not uploaded to CDN, Project not added. Try again",
      });

      setSubmitBtnEnabled(true);
      return;
    }

    if (mode === "create") {
      await addProjectHandler(
        imageProjectId,
        formData.name,
        formData.desc,
        imageUrl,
        formData.link,
        formData.icon1,
        formData.icon2,
        formData.icon3,
        formData.type,
        formData.featured
      );
    } else if (mode === "edit") {
      await editProjectHandler(
        imageProjectId,
        formData.name,
        formData.desc,
        imageUrl,
        formData.link,
        formData.icon1,
        formData.icon2,
        formData.icon3,
        formData.type,
        formData.featured
      );
    } else {
      throw new Error("mode has to be 'create' or 'edit' ");
    }

    // enable button again
    setSubmitBtnDisabled(false);
  }

  function generateId() {
    return uuid();
  }

  async function addProjectHandler(
    id,
    name,
    desc,
    image,
    link,
    icon1,
    icon2,
    icon3,
    type,
    featured
  ) {
    let addProjectResponse;
    try {
      //add project
      addProjectResponse = await addProject(
        id,
        name,
        desc,
        image,
        link,
        icon1,
        icon2,
        icon3,
        type,
        featured
      );

      if (addProjectResponse.success) {
        setFormData(formDataInitialState);

        // TODO: RESET THE FILE SELECTION
        acceptedFiles.shift();

        includeProjectToList(addProjectResponse.data.project);
        setStatusMessage({
          status: SUCCESS,
          message: "Project successfully added!",
        });
      } else {
        setStatusMessage({
          status: FAILED,
          message: addProjectResponse.message,
        });
      }
    } catch (err) {
      setStatusMessage({
        status: FAILED,
        message: "Something went wrong! Project not added",
      });
      return;
    }
  }

  async function editProjectHandler(
    id,
    name,
    desc,
    image,
    link,
    icon1,
    icon2,
    icon3,
    type,
    featured
  ) {
    let updateProjectResponse;
    try {
      updateProjectResponse = await updateProject(
        id,
        name,
        desc,
        image,
        link,
        icon1,
        icon2,
        icon3,
        type,
        featured
      );
      if (updateProjectResponse.success) {
       
        updateProjectInList(updateProjectResponse.data.project);
        setStatusMessage({
          status: SUCCESS,
          message: "Project updated successfully!",
        });
      } else {
        setStatusMessage({
          status: FAILED,
          message: updateProjectResponse.message,
        });
      }
    } catch (err) {
      setStatusMessage({
        status: FAILED,
        message: "Something went wrong! Project update not successful",
      });
      return;
    }
  }

  return (
    <div className={Styles.ModalWrapper}>
      <div>
        <Link to="/dashboard/projects">
          <FaArrowLeft />
        </Link>
      </div>
      <section className={Styles.Modal}>
        <div className={Styles.FormWrapper}>
          <form
            onSubmit={handleSubmit}
            className={Styles.Form}
            encType="multipart/form-data"
            autoComplete="off"
          >
            <h2>{mode === "create" ? "Add new Project" : "Edit Project"}</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Project Title"
                onChange={handleChange}
                value={formData["name"]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="desc">Description</label>
              <textarea
                type="text"
                id="desc"
                placeholder="Site Description"
                onChange={handleChange}
                value={formData["desc"]}
                rows="5"
              ></textarea>
            </div>

            <div className="form-group">
              <div className={Styles.UploadSelectWrapper}>
                <label htmlFor="image">Display Image</label>
                <select
                  id="uploadSelect"
                  onChange={(e) => setImageUploadChoice(e.target.value)}
                >
                  <option value="paste">Paste a Link</option>
                  <option value="upload">Upload an image</option>
                </select>
              </div>
              <div className={Styles.UploadOptionsWrapper}>
                {imageUploadChoice === "upload" ? (
                  <div
                    {...getRootProps({
                      className: `${Styles.DragNDropWrapper}`,
                    })}
                  >
                    <input
                      {...getInputProps({
                        id: "image",
                      })}
                    />
                    {isAFileAccepted && acceptedFiles.map((file) => file.name)}
                    {!isAFileAccepted && acceptedFiles.length > 0 && (
                      <p>File must be an Image!</p>
                    )}
                    {acceptedFiles.length === 0 &&
                      (isDragActive ? (
                        <p>Drop here</p>
                      ) : (
                        <p>Drag n Drop Image here</p>
                      ))}
                  </div>
                ) : (
                  <input
                    type="url"
                    id="image"
                    placeholder="Paste url for display cover"
                    onChange={handleChange}
                    value={formData["image"]}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="link">Site URL</label>
              <input
                type="url"
                id="link"
                placeholder="URL"
                onChange={handleChange}
                value={formData["link"]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon1">Icon 1</label>
              <input
                type="string"
                id="icon1"
                placeholder="Icon1"
                onChange={handleChange}
                value={formData["icon1"]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon2">Icon 2</label>
              <input
                type="string"
                id="icon2"
                placeholder="Icon2"
                onChange={handleChange}
                value={formData["icon2"]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon3">Icon 3</label>
              <input
                type="string"
                id="icon3"
                placeholder="Icon3"
                onChange={handleChange}
                value={formData["icon3"]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <input
                type="string"
                id="type"
                onChange={handleChange}
                value={formData["type"]}
              />
            </div>

            <div className="form-groups">
              <label htmlFor="featured">Featured?</label>
              <br />
              <span className="form-group">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  onChange={handleChange}
                  value={formData["featured"]}
                  checked={formData["featured"]}
                />
              </span>
            </div>

            <div className={" form-group " + Styles.ButtonGroup}>
              <button
                type="submit"
                className={Styles.Submit}
                ref={submitBtnRef}
              >
                {processingRequest ? (
                  "Processing..."
                ) : mode === "create" ? (
                  <>
                    <FaPlusCircle /> {" Add Project"}{" "}
                  </>
                ) : (
                  <>
                    <FaEdit /> {" Make Changes"}
                  </>
                )}
              </button>

              <button
                className={Styles.CloseBtn}
                type="button"
                onClick={() => closeModal()}
              >
                <AiOutlineClose /> Close
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ProjectsModal;
