import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import Navbar from "./Navbar.jsx";

function AdminPanel() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));

    fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  if (!user || user.role_id !== 1) {
    return (
      <div>
        <h2>Pristup odbijen</h2>
        <p>Samo administrator može pristupiti ovoj stranici.</p>
        <Link to="/">Nazad na početnu</Link>
      </div>
    );
  }

  const lostCount = items.filter((item) => item.item_type === "LOST").length;
  const foundCount = items.filter((item) => item.item_type === "FOUND").length;

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Da li želite obrisati ovaj predmet?");
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.reload();
    }
  };

  const updateItemStatus = async (item, newStatus) => {
    let status_id = 1;

    if (newStatus === "RESOLVED") status_id = 2;
    if (newStatus === "ARCHIVED") status_id = 3;

    let item_type_id = 1;
    if (item.item_type === "FOUND") item_type_id = 2;

    let category_id = 1;
    if (item.category === "Elektronika") category_id = 2;
    if (item.category === "Ključevi") category_id = 3;
    if (item.category === "Odjeća") category_id = 4;
    if (item.category === "Novčanik") category_id = 5;
    if (item.category === "Ostalo") category_id = 6;

    let location_id = 1;
    if (item.location === "Biblioteka") location_id = 2;
    if (item.location === "Studentski dom") location_id = 3;
    if (item.location === "Kampus") location_id = 4;
    if (item.location === "Ostalo") location_id = 5;

    const response = await fetch(`http://localhost:5000/api/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        image_url: item.image_url || "",
        item_type_id,
        category_id,
        location_id,
        status_id,
        lost_found_date: item.lost_found_date?.substring(0, 10)
      })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div>

    <Navbar
      user={user}
      token={token}
      handleLogout={handleLogout}
    />

    <div className="page-title">
      <h1>Admin Panel</h1>
      <p>Administracija sistema Lost & Found</p>
    </div>

    <div className="stats"></div>

      <div className="stats">
        <div className="item-card">
          <h3>{users.length}</h3>
          <p>Ukupno korisnika</p>
        </div>

        <div className="item-card">
          <h3>{items.length}</h3>
          <p>Ukupno predmeta</p>
        </div>

        <div className="item-card">
          <h3>{lostCount}</h3>
          <p>Izgubljeni predmeti</p>
        </div>

        <div className="item-card">
          <h3>{foundCount}</h3>
          <p>Pronađeni predmeti</p>
        </div>
      </div>

      <hr />

      <h2>Registrovani korisnici</h2>

      {users.map((u) => (
        <div key={u.id} className="item-card">

          <div className="item-info">

            <h3>
              {u.first_name} {u.last_name}
            </h3>

            <p><strong>Email:</strong> {u.email}</p>

            <p><strong>Telefon:</strong> {u.phone}</p>

            <p><strong>Uloga:</strong> {u.role}</p>

           </div>

        </div>
      ))}

      <hr />

      <h2>Svi prijavljeni predmeti</h2>

      {items.map((item) => (
        <div key={item.id} className="item-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Kategorija: {item.category}</p>
          <p>Lokacija: {item.location}</p>
          <p>Status: {item.status}</p>
          <p>
            Korisnik: {item.first_name} {item.last_name}
          </p>

          <label>Promijeni status:</label>
          <br />
          <select
            defaultValue={item.status}
            onChange={(e) => updateItemStatus(item, e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          <br />

          <button onClick={() => deleteItem(item.id)}>
            Obriši predmet
          </button>
        </div>
      ))}
    </div>
  );
}
export default AdminPanel;
