import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3004/authors");
      const data = await response.data;
      setBooks(data);
    } catch (error) {
      setError("Da co loi xay ra: " + error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:3004/authors/" + id).then(() => {
      fetchData();
      toast.success("Xoa thanh cong");
    });
  };

  const handleEdit = (item) => {
    setSelectedBookId(item.id);
    setName(item.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (selectedBookId) {
        axios
          .put("http://localhost:3004/authors/" + selectedBookId, {
            id: 5,
            name: name,
          })
          .then(() => {
            toast.success("Cap nhat thanh cong");
            fetchData();
            setName("");
            setSelectedBookId(null);
          })
          .catch((error) => {
            toast.error("Da co loi xay ra");
          });
      } else {
        axios
          .post("http://localhost:3004/authors", {
            id: uuidv4(),
            name: name,
          })
          .then(() => {
            toast.success("Them moi thanh cong");
            fetchData();
          });
      }
    } catch (error) {
      console.log(error.status, "error.status");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (books && books.length === 0) {
    return <p>Khong co du lieu</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleChange}
        />
        <button type="submit">{selectedBookId ? "Update" : "Create"}</button>
      </form>
      <ul>
        {books ? (
          books.map((item) => (
            <li key={item.id}>
              {item.name}{" "}
              <button type="button" onClick={() => handleDelete(item.id)}>
                Xoa
              </button>{" "}
              <button type="button" onClick={() => handleEdit(item)}>
                Edit
              </button>
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
}

export default App;
