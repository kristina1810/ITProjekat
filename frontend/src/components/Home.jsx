import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { Search } from "lucide-react";

function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  }, []);

  const filteredItems = items.filter((item) => {
    const title = item.title || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      filter === "ALL" || item.item_type === filter;

    const matchesCategory =
      categoryFilter === "ALL" ||
      item.category === categoryFilter;

    const matchesLocation =
      locationFilter === "ALL" ||
      item.location === locationFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesLocation
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite obrisati predmet?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `http://localhost:5000/api/items/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
  <div>

    <h1 className="main-title">
  <Search size={58} strokeWidth={2.5} />
  Lost & Found
</h1>

    <p className="subtitle">
        Platforma za prijavu izgubljenih i pronađenih predmeta na kampusu.
    </p>

    <Navbar
      user={user}
      token={token}
      handleLogout={handleLogout}
    />

    <hr />

      <div className="hero-text">
        <p>
            ✨ Platforma za prijavu izgubljenih i pronađenih predmeta.
        </p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Pretraži predmete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <button onClick={() => setFilter("ALL")}>Svi</button>
          <button onClick={() => setFilter("LOST")}>
            Izgubljeni
          </button>
          <button onClick={() => setFilter("FOUND")}>
            Pronađeni
          </button>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="ALL">Sve kategorije</option>
            <option value="Dokumenti">Dokumenti</option>
            <option value="Elektronika">Elektronika</option>
            <option value="Ključevi">Ključevi</option>
            <option value="Odjeća">Odjeća</option>
            <option value="Novčanik">Novčanik</option>
            <option value="Ostalo">Ostalo</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) =>
              setLocationFilter(e.target.value)
            }
          >
            <option value="ALL">Sve lokacije</option>
            <option value="Fakultet">Fakultet</option>
            <option value="Biblioteka">Biblioteka</option>
            <option value="Studentski dom">
              Studentski dom
            </option>
            <option value="Kampus">Kampus</option>
            <option value="Ostalo">Ostalo</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p>Nema pronađenih predmeta.</p>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
  <div key={item.id} className="item-card">

    <div className="item-image-box">
      {item.image_url ? (
        <img
          src={`http://localhost:5000/uploads/${item.image_url}`}
          alt={item.title}
        />
      ) : (
        <div className="no-image">
          📷 Nema slike
        </div>
      )}
    </div>

    <div className="item-info">

      <div className="item-header">

        <h3>{item.title}</h3>

        <span
          className={
            item.item_type === "FOUND"
              ? "badge badge-found"
              : "badge badge-lost"
          }
        >
          {item.item_type}
        </span>

      </div>

      <p className="item-description">
        {item.description}
      </p>

      <div className="item-meta">

        <span>📂 {item.category}</span>

        <span>📍 {item.location}</span>

        <span>
          👤 {item.first_name} {item.last_name}
        </span>

        <span
          className={
            item.status === "ACTIVE"
              ? "status status-active"
              : item.status === "RESOLVED"
              ? "status status-resolved"
              : "status status-archived"
          }
        >
          {item.status}
        </span>

      </div>

      {(user?.role_id === 1 || user?.id === item.user_id) && (
        <div className="item-actions">

          <Link to={`/edit-item/${item.id}`}>
            <button>Izmijeni</button>
          </Link>

          <button onClick={() => handleDelete(item.id)}>
            Obriši
          </button>

        </div>
      )}

    </div>

  </div>
))}
        </div>
      )}
    </div>
  );
}
export default Home;
