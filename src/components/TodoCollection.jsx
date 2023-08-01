import TodoItem from './TodoItem';

const TodoCollection = ({
  todos,
  onToggleDone,
  onSave,
  onDelete,
  onChangeMode,
}) => {
  return (
    <div>
      TodoCollection
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onChangeMode={onChangeMode}
            onSave={onSave}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default TodoCollection;
