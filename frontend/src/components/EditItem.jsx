import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";

function EditItem() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [item_type_id, setItemTypeId] = useState("1");
  const [category_id, setCategoryId] = useState("1");
  const [location_id, setLocationId] = useState("1");
  const [status_id, setStatusId] = useState("1");
  const [lost_found_date, setLostFoundDate] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => res.json())
      .then((item) => {
        setTitle(item.title || "");
        setDescription(item.description || "");
        setImageUrl(item.image_url || "");

        setLostFoundDate(
          item.lost_found_date
            ? item.lost_found_date.substring(0, 10)
            : ""
        );

        if (item.item_type === "LOST") setItemTypeId("1");
        if (item.item_type === "FOUND") setItemTypeId("2");

        if (item.category === "Dokumenti") setCategoryId("1");
        if (item.category === "Elektronika") setCategoryId("2");
        if (item.category === "Ključevi") setCategoryId("3");
        if (item.category === "Odjeća") setCategoryId("4");
        if (item.category === "Novčanik") setCategoryId("5");
        if (item.category === "Ostalo") setCategoryId("6");

        if (item.location === "Fakultet") setLocationId("1");
        if (item.location === "Biblioteka") setLocationId("2");
        if (item.location === "Studentski dom") setLocationId("3");
        if (item.location === "Kampus") setLocationId("4");
        if (item.location === "Ostalo") setLocationId("5");

        if (item.status === "ACTIVE") setStatusId("1");
        if (item.status === "RESOLVED") setStatusId("2");
        if (item.status === "ARCHIVED") setStatusId("3");
      });
  }, [id]);

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        image_url,
        item_type_id,
        category_id,
        location_id,
        status_id,
        lost_found_date
      })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div>
      <h2>Izmijeni predmet</h2>

      <form onSubmit={handleUpdateItem}>
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
          <label>Status:</label>
          <br />
          <select
            value={status_id}
            onChange={(e) => setStatusId(e.target.value)}
          >
            <option value="1">ACTIVE</option>
            <option value="2">RESOLVED</option>
            <option value="3">ARCHIVED</option>
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

        <button type="submit">Sačuvaj izmjene</button>
      </form>

      <p>
        <Link to="/">Nazad na početnu</Link>
      </p>
    </div>
  );
}
export default EditItem;
