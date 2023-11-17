import axios from 'axios';

//定義串接的 end point 網址
const authURL = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({ username, password }) => {
  try {
    //他會回傳我們一組auth token，因為axios的關係，回傳的response都會被封裝在一個data的物件裡面，我們用解構的方式取到data值
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });

    //我們可以在這裡console.log一下看後端傳來的data有什麼
    console.log(data);

    //我們用解構的方式取到data裡面authToken的值
    const { authToken } = data;
    //如果authToken為true，則代表登入成功
    if (authToken) {
      return { success: true, ...data }; //在把後端傳來的成功data回傳資料給頁面做使用時，一併整理資料格式，加上 success 屬性做為 flag，之後就能用 success 屬性來判斷是否登入成功。這個data裡面有authToken會回傳出去
    }

    //登入失敗的話，我也必須讓我的頁面知道，並把後段的response data(這裡會是fail的data)給回傳給頁面
    return data;
  } catch (error) {
    console.error('[Login Failed]:', error);
  }
};

export const register = async ({ username, email, password }) => {
  try {
    //相較於login多了一個email的payload
    const { data } = await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    });

    //我們可以在這裡console.log一下看後端傳來的data有什麼
    console.log(data);

    const { authToken } = data; 

    if (authToken) {
      return { success: true, ...data };
    }

    return data;
  } catch (error) {
    console.error('[Register Failed]: ', error);
  }
};

// 每個頁面身份驗證功能：串接 checkPermission 功能
// 我們需要把authToken帶給後端去做驗證
// payload指的是具有意義、有效的資料，放在body和URL裡參數也算是payload，所以get後面第二個參數整個是一個要給後端的payload
export const checkPermission = async (authToken) => {
  try {
    const response = await axios.get(`${authURL}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });

    return response.data.success;
  } catch (err) {
    console.error('[Check Permission Failed]', err);
  }
};
