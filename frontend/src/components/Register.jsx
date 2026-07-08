import {useState} from "react";

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
export default Register;
