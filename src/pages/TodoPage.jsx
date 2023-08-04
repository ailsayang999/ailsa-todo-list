import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../api/auth';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const todoNums = todos.length;
  const navigate = useNavigate();

  //監聽器：handleChange
  const handleChange = (value) => {
    setInputValue(value);
  };

  //監聽器：handleAddTodo
  const handleAddTodo = async (inputValue) => {
    if (inputValue.length === 0) {
      return;
    }

    //因為他也是非同步的操作，可能會有失敗的狀況，所以我也是用try catch把它包起來
    try {
      //會給後端儲存的資料有：title(我們輸入的資料是inputValue)、isDone(一開始todo建立時都是isDone都是false)
      //然後因為我們是用await方法的話，我們的handleAddTodo這個函式要改成async function
      //我們在createTodo裡面給payload，也就是給我們想要新增的資訊，在api的todo.js那裡就會去處理並return後端新增資料後的res.data，然後我們把這個res.data存到data裡面，再用setTodos來更新React裡面的todos的state
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      //因為後端其實會實際幫我們generate實際的todo id，所以我們拿到data的時候，我們可以在setTodos的id那裡帶入後端幫我們產生的id，然後title和isDone都可以直接從後端建立好並傳來的data拿值
      //跟getTodosAsync一樣，我們會帶上isEdit這個欄位，我們先給他false的值
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });

      setInputValue('');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  //監聽器：handleKeyPress （跟handleAddTodo同理）
  const handleKeyPress = async (inputValue) => {
    if (inputValue.length === 0) {
      return;
    }

    //因為他也是非同步的操作，可能會有失敗的狀況，所以我也是用try catch把它包起來
    try {
      //會給後端儲存的資料有：title(我們輸入的資料是inputValue)、isDone(一開始todo建立時都是isDone都是false)
      //然後因為我們是用await方法的話，我們的handleAddTodo這個函式要改成async function
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      //因為後端其實會實際幫我們generate實際的todo id，所以我們拿到data的時候，我們可以在setTodos的id那裡帶入後端幫我們產生的id，然後title和isDone都可以直接從後端建立好並傳來的data拿值
      //跟getTodosAsync一樣，我們會帶上isEdit這個欄位，我們先給他false的值
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });

      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  //監聽器：handleToggleDone
  const handleToggleDone = async (id) => {
    //會在handelToggleDone跟handleSave會去做PATCH的動作

    //先找出使用者Toggle的項目
    const currentTodo = todos.find((todo) => todo.id === id);

    try {
      const newTodo = await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      }); //可以看到Toggle只有改到isDone的true false，所以傳給patchTodo的payload只有id跟isDone的值

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === newTodo.id) {
            return {
              ...todo,
              isDone: newTodo.isDone,
            };
          }
          return todo; //其他todo原封不動傳回去
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  //監聽器：handleChangeMode {id,isEdit}是解構賦值
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit: isEdit,
          }; //有被編輯的加上isEdit: true
        }

        return { ...todo, isEdit: false }; //其他沒有被編輯的加上isEdit: false
      });
    });
  };

  //監聽器：handleSave {id,title}是解構賦值
  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({
        id,
        title,
      });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title: title,
              isEdit: false,
            };
          }
          return todo;
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  //監聽器：handleDelete {id,title}是解構賦值
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodo) => prevTodo.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  //串接API: 從後端拿到我們所有todos 資料後會更新 todos 的state，畫面會重新更新
  useEffect(() => {
    const getTodosAsync = async () => {
      //因為getTodos是非同步的操作，有可能會失敗，所以我們要用try catch把它包起來
      try {
        const todos = await getTodos(); //用await去取得所有後端todos的項目
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false }))); //把所有todo的property展開，並幫他加上isEdit這個property
      } catch (error) {
        console.error(error);
      }
    };
    //getTodosAsync這個function定義完成之後，我們可以直接執行它
    getTodosAsync();
  }, []); //後面的dependency讓他是空的，因為只要在畫面一開始被渲染的時候才做操作

  // 要把驗證每一頁的token是否為有效的function，放到這個頁面上
  useEffect(() => {
    const checkTokenIsValid = async () => {
      // 去localStorage取 authToken
      const authToken = localStorage.getItem('authToken');
      // 如果authToken不存在的話（比如說登出的時後）代表它就是一個為驗證未登入的狀態
      if (!authToken) {
        // 如果authToken不存在，對於Todo頁面，不應停留在當前頁面，要navigate到login
        navigate('/login');
      }
      // 當我們的authToken是存在的話(使用者有登入的時候)，就把authToken給checkPermission檢查，他會回傳是否是有效的登入(會回傳response.data.success，那這邊success裡面可能是true或false，這個boolean會被放到result裡面)
      const result = await checkPermission(authToken);
      //如果這個authToken是無效的話，我們不應該停留在todo頁面，要導引到login頁面
      if (!result) {
        navigate('/login');
      }
    };
    //當就執行checkTokenIsValid
    checkTokenIsValid();
  }, [navigate]); //因為有用到navigate這個function，所以就把它放到useEffect的dependency上

  return (
    <div>
      TodoPage
      <Header />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDone={handleKeyPress}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer numOfTodos={todoNums} />
    </div>
  );
};

export default TodoPage;
