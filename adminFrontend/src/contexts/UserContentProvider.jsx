import React, { createContext, useContext, useReducer } from 'react';
import {  useState } from 'react';
import useBaseUrl from '../hooks/useBaseUrl';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useAuthContext } from './AuthProvider';

const UserContentContext = createContext();

const projectsReducer = (state, action) => {
  if (action.type === 'POPULATE') {
    return [...action.payload];
  } else if (action.type === 'ADD') {
    return [...state, action.payload];
  } else if (action.type === 'UPDATE_PROJECT') {
    return state.map((item) => {
      if (item.id === action.payload.id) {
        return { ...action.payload };
      }
      return item;
    });
  } else if (action.type === 'DELETE_PROJECT') {
    return state.filter((item) => item.id !== action.payload);
  }

  throw new Error('Action type for projects does not match any defined type');
};

export function useUserContentContext() {
  return useContext(UserContentContext);
}

function UserContentProvider({ children }) {
  const [projects, projectDispatch] = useReducer(projectsReducer, []);
  const [statusMessage, setStatusMessage] = useSessionStorage("STATUS_MESSAGE", {
    status: '',
    message: '',
  });

  const [dbCollections, setDbCollections] = useState([])

  const [openModal, setOpenModal] = useSessionStorage("OPEN_MODAL", {
    open: false,
    mode: null,
  });
  const [currentProject, setCurrentProject] = useSessionStorage("CURRENT_PROJECT", {});

  const { CONTENT_URL_BASE } = useBaseUrl();
  const { FILE_SERVER_BASE } = useBaseUrl();

  const { token } = useAuthContext();

  async function fetchProjects() {
    const data = await (await fetch(CONTENT_URL_BASE + '/projects')).json();
    if (data.success) {
      projectDispatch({ type: 'POPULATE', payload: data.data.projects });
    }
  }
  function includeProjectToList(project) {
    projectDispatch({ type: 'ADD', payload: project });
  }
  function updateProjectInList(project) {
    projectDispatch({ type: 'UPDATE_PROJECT', payload: project });
  }
  function deleteProjectFromList(id) {
    projectDispatch({ type: 'DELETE_PROJECT', payload: id });
  }


  async function getDbCollections() {
    const errorMsg = "Error when trying to get database collections. Try again"
    try {
      const response = await (await fetch(CONTENT_URL_BASE, { 
        headers: {
          "Authorization": "Bearer " + token
        }
       })).json()

      if (response.success === false) {
        return { success: false, message: errorMsg }
      }
      setDbCollections(response.data)
      return response

    } catch (err) {
      return { success: false, message: errorMsg }
    }
  }



  async function addProject(
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
    try {
      const newProject = await (
        await fetch(CONTENT_URL_BASE + '/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            id,
            name,
            desc,
            image,
            link,
            icon1,
            icon2,
            icon3,
            type,
            featured,
          }),
        })
      ).json();
      return newProject;
    } catch (err) {
      return { success: false, message: 'Something went wrong! Try again' };
    }
  }

  async function updateProject(
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
    try {
      const response = await (
        await fetch(`${CONTENT_URL_BASE}/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            id,
            name,
            desc,
            image,
            link,
            icon1,
            icon2,
            icon3,
            type,
            featured,
          }),
        })
      ).json();
      return response;
    } catch (err) {
      return { success: false, message: "Couldn't update project. Try again" };
    }
  }

  async function deleteProject(id) {
    try {
      const data = await (
        await fetch(`${CONTENT_URL_BASE}/projects/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
      ).json();
      return data;
    } catch (err) {
      return { success: false, message: "Couldn't delete project. Try again" };
    }
  }

  async function uploadToCdn(file, projectId) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('projectId', projectId);
    try {
      const response = await (
        await fetch(`${FILE_SERVER_BASE}`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
      ).json();
      return response;
    } catch (err) {
      return { success: false, message: "Couldn't upload to cdn" };
    }
  }

  async function deleteFromCdn(url) {
    const response = await (
      await fetch(FILE_SERVER_BASE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ url }),
      })
    ).json();
    return response;
  }

  async function updateImageUrl(id, url) {
    const data = await (
      await fetch(`${CONTENT_URL_BASE}/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          coverImage: url,
        }),
      })
    ).json();
    return data;
  }


  // async function fetchUserContent(){
  // 	const resp = await getDbCollections()
  // 	// TODO: use the appropriate variable to fill the value for `status`
  // 	if (resp.success === false){
  // 		setStatusMessage({ status:  , message: resp.message})
  // 	}else{
  // 		await fetchProjects();
  // 	}
  // }

  // useEffect(() => {
  //   if (token) {
  // 	  fetchUserContent()
  //   }
  // }, [token]);

  return (
    <UserContentContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        reloadProjects: fetchProjects,
        openModal,
        setOpenModal,
        setCurrentProject,
        currentProject,
        statusMessage,
        setStatusMessage,
        uploadToCdn,
        deleteFromCdn,
        updateImageUrl,
        includeProjectToList,
        updateProjectInList,
        deleteProjectFromList,
        getDbCollections
      }}
    >
      {children}
    </UserContentContext.Provider>
  );
}

export default UserContentProvider;
