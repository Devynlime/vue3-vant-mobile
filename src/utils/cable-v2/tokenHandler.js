import request from "@/utils/request";
import { GDE_TOKEN_KEY } from "@/stores/mutation-type";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  return request({
    url: "/auth/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data,
  });
}

/**
 * 电缆井获取token
 * @description 通过用户信息和票据获取访问令牌
 * @param {string} userName - 用户名
 * @param {string} userId - 用户ID
 * @param {string} ticket - 票据
 * @param {string} sm4key - SM4加密密钥
 * @returns {Promise} 返回包含token的Promise对象
 */
export const getToken = (userName, userId, ticket, sm4key) => {
  const data = {
    userName,
    userId,
    ticket,
    sm4key,
  };
  return request({
    url: "/auth/igw-login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
};

const username = "admin";
const password = "Cable@2024";

export const mockLogin = () => {
  login(username, password, "code", "uuid")
    .then((res) => {
      const data = res.data;
      localStorage.setItem(GDE_TOKEN_KEY, data.access_token);
      resolve();
    })
    .catch((error) => {
      reject(error);
    });
};
