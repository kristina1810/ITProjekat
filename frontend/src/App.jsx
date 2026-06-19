import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function CampusMap({ items }) {
  const locations = {
    "Fakultet": [42.4415, 19.2440],
    "Biblioteka": [42.4425, 19.2450],
    "Studentski dom": [42.4405, 19.2430],
    "Kampus": [42.4430, 19.2460],
    "Ostalo": [42.4395, 19.2420]
  };

  return (
    <div
      style={{
        height: "400px",
        marginBottom: "30px",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >
      <MapContainer
        center={[42.4415, 19.2440]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {items.map((item) => {
          const coords = locations[item.location];

          if (!coords) return null;

          return (
            <Marker key={item.id} position={coords}>
              <Popup>
                <strong>{item.title}</strong>
                <br />
                {item.item_type}
                <br />
                {item.location}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

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

    const matchesType = filter === "ALL" || item.item_type === filter;

    const matchesCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;

    const matchesLocation =
      locationFilter === "ALL" || item.location === locationFilter;

    return matchesSearch && matchesType && matchesCategory && matchesLocation;
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

  return (
    <div>
      <h1>Lost & Found</h1>
      <p>Platforma za izgubljene i pronađene predmete.</p>

      <div className="home-menu">
        <Link to="/">Početna</Link> |{" "}

        {!token && (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Registracija</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/add-item">Dodaj predmet</Link>{" "}

            {user?.role_id === 1 && (
              <>
                | <Link to="/admin">Admin panel</Link>{" "}
              </>
            )}

            | <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {user && (
        <p>
          Prijavljeni ste kao: {user.first_name} {user.last_name}
        </p>
      )}

      <hr />

      <CampusMap items={items} />
      <h2>Predmeti</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Pretraži predmete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <button onClick={() => setFilter("ALL")}>Svi</button>
          <button onClick={() => setFilter("LOST")}>Izgubljeni</button>
          <button onClick={() => setFilter("FOUND")}>Pronađeni</button>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="ALL">Sve lokacije</option>
            <option value="Fakultet">Fakultet</option>
            <option value="Biblioteka">Biblioteka</option>
            <option value="Studentski dom">Studentski dom</option>
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
                  <div className="no-image">Nema slike</div>
                )}
              </div>

              <div className="item-info">
                <div className="item-header">
                  <h3>{item.title || "Bez naslova"}</h3>

                  <span
                    className={
                      item.item_type === "LOST"
                        ? "badge badge-lost"
                        : "badge badge-found"
                    }
                  >
                    {item.item_type}
                  </span>
                </div>

                <p className="item-description">
                  {item.description || "Nema opisa."}
                </p>

                <div className="item-meta">
                  <span>📂 {item.category}</span>
                  <span>📍 {item.location}</span>
                  <span>👤 {item.first_name} {item.last_name}</span>

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    alert(data.message);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            placeholder="Unesite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Lozinka:</label>
          <br />
          <input
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Prijavi se</button>
      </form>

      <p>
        Nemaš nalog? <Link to="/register">Registruj se</Link>
      </p>
    </div>
  );
}

function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        phone,
        password
      })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = "/login";
    }
  };

  return (
    <div>
      <h2>Registracija</h2>

      <form onSubmit={handleRegister}>
        <div>
          <label>Ime:</label>
          <br />
          <input
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label>Prezime:</label>
          <br />
          <input
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Telefon:</label>
          <br />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div>
          <label>Lozinka:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Registruj se</button>
      </form>
    </div>
  );
}

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

function AdminPanel() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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
      <h2>Admin panel</h2>
      <p>Dobrodošli, administratoru.</p>

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

      <Link to="/">Nazad na početnu</Link>

      <hr />

      <h3>Korisnici</h3>

      {users.map((u) => (
        <div key={u.id} className="item-card">
          <h3>
            {u.first_name} {u.last_name}
          </h3>
          <p>Email: {u.email}</p>
          <p>Telefon: {u.phone}</p>
          <p>Uloga: {u.role}</p>
        </div>
      ))}

      <hr />

      <h3>Svi predmeti</h3>

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;