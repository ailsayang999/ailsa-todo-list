//引用axios
import axios from 'axios';

//因為我們的todos api是run在json server上，然後我們的json server run 在 http://localhost:3001上。所以我們要把這個URL給定義出來

const baseUrl = ' http://localhost:3001';

//接下來會實作四個功能

//瀏覽後端的todos
//如果我們要用async await的話，getTodos, createTodo, patchTodo, deleteTodo本身要是一個async的function
//要把會用到的方法給export出去
export const getTodos = async () => {
  try {
    //放上獲得todos的位址：${baseUrl}/todos，這樣就可以獲得後端todos的資料了
    //因為axios.get是非同步的操作，所以我們要await他
    //獲得的結果會在response裡
    const response = await axios.get(`${baseUrl}/todos`);
    return response.data; //但是我們用axios這個套件來發送api request 的時候，我們實際回傳的結果會被封裝在一個叫data的property裡面，所以我們在return時要用response.data，才會取得到真正的資料結果
  } catch (error) {
    //由於後端資料庫是外部的操作，也需要考慮到回應失敗的狀況，因此需要查看錯誤訊息來了解情況。如果發送請求失敗的話就會進到catch
    //我們直接把錯誤訊息顯示出來
    console.error('[Get Todos failed]:', error);
  }
};

//新增todo資料到後端
export const createTodo = async (payload) => {
  try {
    //因為要用POST的話，會需要帶資料給server，所以在實作這個方法的時候我們會需要一個payload參數
    //這個payload裡面會有使用者在TodoPage裡面傳來要新增的title，和是否具體被完成的isDone
    //變數 payload 通常用來表示「打包後的資訊」，在這裡打包了使用者想要新增的 todo 內容
    const { title, isDone } = payload; //我們透過{}解構的方式可以取得使用者新增的title和isDone這兩個的值
    const res = await axios.post(`${baseUrl}/todos`, {
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
    const res = await axios.patch(`${baseUrl}/todos/${id}`, {
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
    const res = await axios.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (err) {
    console.error('[Delete Todo failed]:', err);
  }
};
