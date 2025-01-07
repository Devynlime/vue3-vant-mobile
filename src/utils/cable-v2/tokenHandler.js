import request from "@/utils/request";
import { GDE_TOKEN_KEY } from "@/stores/mutation-type";
import { STORAGE_TOKEN_KEY, IGW_USER_KEY } from "@/stores/mutation-type";

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

// const username = "admin";
// const password = "Cable@2024";

// export const mockLogin = () => {
//   login(username, password, "code", "uuid")
//     .then((res) => {
//       const data = res.data;
//       localStorage.setItem(GDE_TOKEN_KEY, data.access_token);
//       resolve();
//     })
//     .catch((error) => {
//       reject(error);
//     });
// };

// refreshCableToken
export async function refreshCableToken() {
  const userId = localStorage.getItem("userId") || "";
  const sm4key = localStorage.getItem("sm4Key") || "";
  const wxcode = localStorage.getItem("wxcode") || "";
  let tokenParams = { userName: "default", userId, ticket: wxcode, sm4key };

  try {
    // 从本地存储获取i国网用户信息
    tokenParams.userName = igwMethods.getPWUserInfo().userAccount;

    // 调用微信SDK获取授权码
    // @ts-expect-error 这里需要使用微信的js-sdk
    const ticket = wx.invoke(
      "getAuthCode",
      {
        responseType: "code", // 固定参数
        scope: "snsapi_base", // 固定参数
      },
      (res) => {
        console.log("js获取code:", res);
        if (res.code) {
          tokenParams.ticket = res.code;
          console.log("☞tokenParams.ticket:", tokenParams.ticket);
        }
      }
    );

    // tokenParams.ticket = ticket;
  } catch (error) {
    console.error("重新获取电缆井token失败:", error);
  }

  // 如果成功获取新token则更新到本地存储
  const result = await getToken(
    tokenParams.userName,
    tokenParams.userId,
    tokenParams.ticket,
    tokenParams.sm4key
  );
  if (result?.data?.access_token) {
    const existingToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (existingToken) {
      console.log("☞access_token 已经存在", existingToken);
    }
    localStorage.setItem(STORAGE_TOKEN_KEY, result.data.access_token);
    console.log("☞access_token 成功更新", result.data.access_token);
    return true;
  }
  return false;
}
