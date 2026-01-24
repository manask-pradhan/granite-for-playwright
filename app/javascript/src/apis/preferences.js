import axios from "axios";

const show = () => axios.get("/preference");

const update = ({ payload }) => axios.put("/preference", payload);

const mail = ({ payload }) => axios.patch(`/preference/mail`, payload);

const preferencesApi = {
  show,
  update,
  mail,
};

export default preferencesApi;
