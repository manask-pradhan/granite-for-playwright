import axios from "axios";

const fetch = () => axios.get("/users");

const usersApi = {
  fetch,
};

export default usersApi;
