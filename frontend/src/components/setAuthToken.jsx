import axios from "axios";

// This is the function for checking authorization that is used through the app
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

export default setAuthToken
