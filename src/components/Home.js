

const Home = () => (
<div style={{ padding: "40px" }}>
  <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
    Hospital Prescription System
  </h2>
  <p style={{ textAlign: "center", color: "#777", marginBottom: "40px" }}>
    Manage patients, medicines and prescriptions in one place
  </p>

  <div style={{ display: "flex", gap: "25px", justifyContent: "center", flexWrap: "wrap" }}>

    {/* Patients */}
    <div
      style={{
        width: "300px",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
         background: "linear-gradient(135deg, #396afc, #2948ff)",
        
        boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        transition: "0.3s",
        textAlign: "center",
        cursor: "pointer"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: "50px", marginBottom: "15px" }}>👨‍⚕️</div>
      <h4>Patient Management</h4>
      <p>Register and manage patient records.</p>
      <a href="/patients" style={{
        display: "block",
        marginTop: "20px",
        padding: "10px",
        background: "white",
        color: "#1d976c",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Open
      </a>
    </div>

    {/* Medicines */}
    <div
      style={{
        width: "300px",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
               background: "linear-gradient(135deg, #1d976c, #93f9b9)",

        boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        transition: "0.3s",
        textAlign: "center",
        cursor: "pointer"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: "50px", marginBottom: "15px" }}>💊</div>
      <h4>Medicine Database</h4>
      <p>Add and manage hospital medicines.</p>
      <a href="/medicines" style={{
        display: "block",
        marginTop: "20px",
        padding: "10px",
        background: "white",
        color: "#2948ff",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Open
      </a>
    </div>

    {/* Prescriptions */}
    <div
      style={{
        width: "300px",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
        background: "linear-gradient(135deg, #f953c6, #b91d73)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        transition: "0.3s",
        textAlign: "center",
        cursor: "pointer"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: "50px", marginBottom: "15px" }}>📝</div>
      <h4>Prescription Management</h4>
      <p>Create and manage prescriptions.</p>
      <a href="/prescriptions" style={{
        display: "block",
        marginTop: "20px",
        padding: "10px",
        background: "white",
        color: "#b91d73",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Open
      </a>
    </div>

  </div>
</div>

);


export default Home;