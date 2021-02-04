import axios from "axios";
import { getToken } from "./store";
let api_url;
if (process.env.NODE_ENV === "development")
  api_url = "http://localhost:5001/admin/api/";
else api_url = "https://strives.herokuapp.com/admin/api/";
let token = getToken();

class ApiCall {
  post = (url, data) =>
    new Promise((resolve, reject) => {
      const headers = {
        Authorization: "Bearer " + token,
      };

      axios
        .post(api_url + url, data, token ? { headers } : undefined)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });

  put = (url, data) =>
    new Promise((resolve, reject) => {
      const headers = {
        Authorization: "Bearer " + token,
      };

      axios
        .put(api_url + url, data, token ? { headers } : undefined)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });

  delete = (url) =>
    new Promise((resolve, reject) => {
      const headers = {
        Authorization: "Bearer " + token,
      };

      axios
        .delete(api_url + url, { headers })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });

  get = (url) =>
    new Promise((resolve, reject) => {
      const headers = {
        Authorization: "Bearer " + token,
      };

      axios
        .get(api_url + url, { headers })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
}

export default new ApiCall();
