import {useState} from "react";
import {Link} from "react-router-dom";

function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [item_type_id, setItemTypeId] = useState("1");
  const [category_id, setCategoryId] = useState("1");
  const [location_id, setLocationId] = useState("1");
  const [lost_found_date, setLostFoundDate] = useState("");
  const [image, setImage] = useState(null);

  const handleAddItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("Morate biti prijavljeni da dodate predmet.");
      window.location.href = "/login";
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("item_type_id", item_type_id);
    formData.append("category_id", category_id);
    formData.append("location_id", location_id);
    formData.append("lost_found_date", lost_found_date);
    formData.append("user_id", user.id);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <h2>Dodaj predmet</h2>

      <form onSubmit={handleAddItem}>
        <div>
          <label>Naslov:</label>
          <br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Opis:</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Tip predmeta:</label>
          <br />
          <select
            value={item_type_id}
            onChange={(e) => setItemTypeId(e.target.value)}
          >
            <option value="1">LOST</option>
            <option value="2">FOUND</option>
          </select>
        </div>

        <div>
          <label>Kategorija:</label>
          <br />
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="1">Dokumenti</option>
            <option value="2">Elektronika</option>
            <option value="3">Ključevi</option>
            <option value="4">Odjeća</option>
            <option value="5">Novčanik</option>
            <option value="6">Ostalo</option>
          </select>
        </div>

        <div>
          <label>Lokacija:</label>
          <br />
          <select
            value={location_id}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="1">Fakultet</option>
            <option value="2">Biblioteka</option>
            <option value="3">Studentski dom</option>
            <option value="4">Kampus</option>
            <option value="5">Ostalo</option>
          </select>
        </div>

        <div>
          <label>Datum:</label>
          <br />
          <input
            type="date"
            value={lost_found_date}
            onChange={(e) => setLostFoundDate(e.target.value)}
          />
        </div>

        <div>
          <label>Slika:</label>
          <br />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button type="submit">Sačuvaj</button>
      </form>

      <p>
        <Link to="/">Nazad na početnu</Link>
      </p>
    </div>
  );
}
export default AddItem;
