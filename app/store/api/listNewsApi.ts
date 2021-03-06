import Config from "@config/configApi";

const axios = require('axios');

export const getListNewsApi = (params: { filters?: { News_Cat: string | number }, limit: string, page: string }) => {
  const config = {
    method: 'get',
    // url: 'https://tvphapluat.vn/api/posts/',
    url: `${Config.API_URL}/posts/`,
    headers: {},
    params: params
  };
  return axios(config)
    .then(function (response: any) {

      return response
    })
    .catch(function (error: any) {
      return error
    });
}
