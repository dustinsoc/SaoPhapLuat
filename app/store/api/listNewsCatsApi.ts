import Config from "@config/configApi";

const axios = require('axios');

export const getListNewsCatsApi = (data: { filters?: { News_Cat: string | number }, limit: string, page: string }) => {

  const config = {
    method: 'post',
    // url: 'https://tvphapluat.vn/api/posts/',
    url: `${Config.API_URL}/posts/`,
    headers: {},
    data: data
  };
  return axios(config)
    .then(function (response: any) {
      return response
    })
    .catch(function (error: any) {
      return error
    });
}
