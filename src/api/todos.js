//引用axios
import axios from 'axios';

//Todo List Server ：每個帳號都有自己的todos資料
// 把原本json server的end point(localhost:3001) 換成todo list的end point
const baseUrl = 'https://todo-list.alphacamp.io/';


const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// 使用 axios 提供的 Interceptors 方法，在發出 request 前、收到 response 後產生一些時間差，讓我們可以設定 Auth Token，我們在之後要去CRUD後端的資料時都要帶上這個 Auth Token，才可以改到後端的資料
// 以下是interceptors方法的設定，裡面有兩個argument，第一個是是對config的改動，第二個是handle請求失敗的情況
axiosInstance.interceptors.request.use(
  (config) => {
    //從localStorage拿出我們的authToken
    const token = localStorage.getItem('authToken');
    //如果我們的token存在的話，我們就去設定我們的header
    if (token) {
      // header的key叫做Authorization，value會用Bearer後面一個空格當作前綴，然後再加上我們的token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // The modified config object is then returned, allowing the request to proceed with the modified configuration設定.
  }, //如果發送請求失敗的話
  (error) => {
    // Do something with request error
    console.error(error);
  },
);



//接下來會實作四個功能

//瀏覽後端的todos
//如果我們要用async await的話，getTodos, createTodo, patchTodo, deleteTodo本身要是一個async的function
//要把會用到的方法給export出去
export const getTodos = async () => {
  try {
    //放上獲得todos的位址：${baseUrl}/todos，這樣就可以獲得後端todos的資料了
    //因為axios.get是非同步的操作，所以我們要await他
    //獲得的結果會在response裡
    const response = await axiosInstance.get(`${baseUrl}/todos`);
    return response.data.data; //但是我們用axios這個套件來發送api request 的時候，我們實際回傳的結果會被封裝在data 的 property 下，所以我們在return時要用res.data.data 取值才可以拿到我們所有的 todoitem
  } catch (error) {
    //由於後端資料庫是外部的操作，也需要考慮到回應失敗的狀況，因此需要查看錯誤訊息來了解情況。如果發送請求失敗的話就會進到catch
    //我們直接把錯誤訊息顯示出來
    console.error('[Get Todos failed]:', error);
  }
};

//新增todo資料到後端
export const createTodo = async (payload) => {
  //因為要用POST的話，會需要帶資料給server，所以在實作這個方法的時候我們會需要一個payload參數
  //這個payload裡面會有使用者在TodoPage裡面傳來要新增的title，和是否具體被完成的isDone
  //變數 payload 通常用來表示「打包後的資訊」，在這裡打包了使用者想要新增的 todo 內容
  const { title, isDone } = payload; //我們透過{}解構的方式可以取得使用者新增的title和isDone這兩個的值
  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    }); //url放第一個參數，而第二個參數就會是我們要傳給server的資料：title, isDone，這裡完整寫法是：{title:title,isDone:isDone}，只是ES6語法可以簡寫，這整個object是告訴server我想要新增這個object，就像在Postman裡面實際操作輸入object的那樣

    return res.data;
  } catch (error) {
    console.error('[Create Todos failed]:', error);
  }
};

//修改後端資料的todo
export const patchTodo = async (payload) => {
  //一樣會有一個payload參數，payload裡面會放使用者要更新的data本身是什麼
  const { id, title, isDone } = payload; //也是用解構的方式取得使用者要更新的相關資料

  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    }); //這裡URL會帶上那筆要更新的資料的id，第二個參數會放入要更新的資料本身：title,isDone的值
    return res.data;
  } catch (error) {
    console.error('[Patch Todo failed]:', error);
  }
};

//刪除後端資料的todo
export const deleteTodo = async (id) => {
  try {
    //只要傳入要刪除的那個項目的id，後端就會去抓id並delete
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (err) {
    console.error('[Delete Todo failed]:', err);
  }
};
