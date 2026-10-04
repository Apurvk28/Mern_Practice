function Users({ users = [], onDelete, onUpdate }) {
  const handleUpdateClick = (user) => {
    const newName = prompt("Enter new name:", user.name);

    if (!newName) {
      return;
    }

    onUpdate(user._id, {
      name: newName,
    });
  };

  return (
    <div>
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}

            <button onClick={() => handleUpdateClick(user)}>
              Update
            </button>

            <button onClick={() => onDelete(user._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;