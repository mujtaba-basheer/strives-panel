export const getToken = () => {
  return localStorage.getItem("token") ? localStorage.getItem("token") : false;
};

export const getUser = () => {
  return localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : false;
};
