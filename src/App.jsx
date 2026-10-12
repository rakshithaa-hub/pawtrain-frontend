import { useState } from "react";
import "./App.css";

// Frontend-only demo data. Changes last only while this page is open.
const DEMO_PROGRAMS = [
    {
        id: 1,
        name: "Puppy Basics",
        description: "Build confidence with essential cues, socialisation, and positive routines.",
        price: 2499,
        durationWeeks: 4,
    },
    {
        id: 2,
        name: "Obedience Training",
        description: "Practise recall, leash manners, and reliable everyday commands.",
        price: 3999,
        durationWeeks: 6,
    },
    {
        id: 3,
        name: "Good Home Manners",
        description: "Help your dog develop calm greetings and better household habits.",
        price: 3299,
        durationWeeks: 5,
    },
];

const DEMO_DOGS = [
    { id: 1, name: "Bruno", breed: "Labrador" },
    { id: 2, name: "Luna", breed: "Indie" },
    { id: 3, name: "Coco", breed: "Beagle" },
];

const INITIAL_BOOKINGS = [
    {
        id: 1001,
        dog: DEMO_DOGS[0],
        trainingProgram: DEMO_PROGRAMS[1],
        bookingDate: "2026-11-05",
        status: "PENDING",
    },
    {
        id: 1002,
        dog: DEMO_DOGS[1],
        trainingProgram: DEMO_PROGRAMS[0],
        bookingDate: "2026-11-08",
        status: "CONFIRMED",
    },
];

function App() {
    const [programs] = useState(DEMO_PROGRAMS);
    const [dogs] = useState(DEMO_DOGS);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedDog, setSelectedDog] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [message, setMessage] = useState("");

    function scrollToSection(id) {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    function openBooking(program) {
        setSelectedProgram(program);
        setSelectedDog("");
        setBookingDate("");
        setMessage("");
        setTimeout(() => scrollToSection("booking"), 100);
    }

    function handleBooking(event) {
        event.preventDefault();

        if (!selectedDog || !bookingDate || !selectedProgram) {
            setMessage("Please choose a dog and booking date.");
            return;
        }

        const dog = dogs.find((item) => String(item.id) === selectedDog);
        const newBooking = {
            id: Date.now(),
            dog,
            trainingProgram: selectedProgram,
            bookingDate,
            status: "PENDING",
        };

        setBookings((current) => [newBooking, ...current]);
        setMessage(
            "Demo booking created successfully! It is pending approval. 🐾 (This is a demo only; it is not sent to a server.)"
        );
        setBookingDate("");
        setSelectedDog("");
    }

    return (
        <div className="app">
            <nav className="navbar">
                <a className="logo" href="#home">🐾 PawTrain</a>
                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#programs">Training</a>
                    <a href="#about">About</a>
                    <a href="#admin-bookings">Admin</a>
                    <button onClick={() => scrollToSection("programs")}>Get Started</button>
                </div>
            </nav>

            <main>
                <section className="hero" id="home">
                    <div className="hero-text">
                        <p className="small-title">PROFESSIONAL DOG TRAINING</p>
                        <h1>Build a better bond with your <span>best friend.</span></h1>
                        <p className="hero-description">
                            Find the right training program for your dog, from basic obedience to good household manners.
                        </p>
                        <button className="hero-button" onClick={() => scrollToSection("programs")}>
                            Explore Training
                        </button>
                    </div>
                    <div className="hero-dog" aria-label="Dog">🐕</div>
                </section>

                <section className="program-section" id="programs">
                    <p className="small-title">OUR PROGRAMS</p>
                    <h2>Training made for every dog</h2>
                    <p className="section-description">
                        Choose a program based on your dog's needs and goals.
                    </p>

                    <div className="program-grid">
                        {programs.map((program) => (
                            <article className="program-card" key={program.id}>
                                <div className="card-icon">🐾</div>
                                <h3>{program.name}</h3>
                                <p>{program.description}</p>
                                <div className="program-info">
                                    <strong>₹{program.price.toLocaleString("en-IN")}</strong>
                                    <span>{program.durationWeeks} weeks</span>
                                </div>
                                <button onClick={() => openBooking(program)}>Choose Program</button>
                            </article>
                        ))}
                    </div>

                    {selectedProgram && (
                        <form className="booking-form" id="booking" onSubmit={handleBooking}>
                            <p className="small-title">LET'S GET STARTED</p>
                            <h2>Book {selectedProgram.name}</h2>
                            <p>Choose your dog and preferred booking date.</p>

                            <label htmlFor="dog">Your dog</label>
                            <select
                                id="dog"
                                value={selectedDog}
                                onChange={(event) => setSelectedDog(event.target.value)}
                                required
                            >
                                <option value="">Select a dog</option>
                                {dogs.map((dog) => (
                                    <option key={dog.id} value={dog.id}>
                                        {dog.name} — {dog.breed}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="bookingDate">Booking date</label>
                            <input
                                id="bookingDate"
                                type="date"
                                value={bookingDate}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(event) => setBookingDate(event.target.value)}
                                required
                            />

                            <div className="admin-actions">
                                <button className="hero-button" type="submit">Confirm Demo Booking</button>
                                <button type="button" onClick={() => {
                                    setSelectedProgram(null);
                                    setMessage("");
                                }}>Close</button>
                            </div>
                            {message && <p className="status-message" role="status">{message}</p>}
                        </form>
                    )}
                </section>

                <section className="about-section" id="about">
                    <div>
                        <p className="small-title">WHY PAWTRAIN?</p>
                        <h2>Better training.<br />Happier dogs.</h2>
                    </div>
                    <div className="features">
                        <article><span>🐶</span><h3>Dog-focused</h3><p>Training designed around your dog's individual needs.</p></article>
                        <article><span>🏆</span><h3>Professional</h3><p>Structured programs that support consistent progress.</p></article>
                        <article><span>❤️</span><h3>Better Bond</h3><p>Build trust and a stronger relationship with your dog.</p></article>
                    </div>
                </section>

                <section className="program-section" id="admin-bookings">
                    <p className="small-title">ADMIN PANEL</p>
                    <h2>Manage Training Bookings</h2>
                    <p className="section-description">
                        Demo credentials: username <strong>raax</strong>, password <strong>demo123</strong>.
                        Demo data only; no real account is authenticated.
                    </p>
                    <AdminBookings bookings={bookings} setBookings={setBookings} />
                </section>
            </main>

            <footer>
                <div className="logo">🐾 PawTrain</div>
                <p>Helping dogs become their best selves.</p>
                <p>© 2026 PawTrain · Frontend demo</p>
            </footer>
        </div>
    );
}

function AdminBookings({ bookings, setBookings }) {
    const [username, setUsername] = useState("raax");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");

    function handleLogin(event) {
        event.preventDefault();
        if (username.trim() === "raax" && password === "demo123") {
            setIsLoggedIn(true);
            setMessage("Demo admin login successful.");
        } else {
            setMessage("For this demo, use username raax and password demo123.");
        }
    }

    function updateStatus(id, status) {
        setBookings((current) =>
            current.map((booking) =>
                booking.id === id ? { ...booking, status } : booking
            )
        );
        setMessage(`Demo booking #${id} marked ${status.toLowerCase()}.`);
    }

    function handleLogout() {
        setIsLoggedIn(false);
        setPassword("");
        setMessage("You have logged out of the demo admin panel.");
    }

    return (
        <div className="admin-bookings">
            {!isLoggedIn ? (
                <form className="booking-form" onSubmit={handleLogin}>
                    <h3>Admin Demo Login</h3>
                    <label htmlFor="adminUsername">Username</label>
                    <input
                        id="adminUsername"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                    <label htmlFor="adminPassword">Password</label>
                    <input
                        id="adminPassword"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    {message && <p className="status-message" role="status">{message}</p>}
                    <button className="hero-button" type="submit">Log In</button>
                </form>
            ) : (
                <>
                    <div className="admin-actions">
                        <button onClick={() => setMessage("Bookings refreshed from the current demo state.")}>
                            Refresh Bookings
                        </button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                    {message && <p className="status-message" role="status">{message}</p>}
                    {bookings.length === 0 ? (
                        <p>No demo bookings yet. Create one using Choose Program.</p>
                    ) : (
                        <div className="program-grid">
                            {bookings.map((booking) => (
                                <article className="program-card" key={booking.id}>
                                    <h3>Booking #{String(booking.id).slice(-6)}</h3>
                                    <p><strong>Dog:</strong> {booking.dog?.name ?? "Unknown"} ({booking.dog?.breed ?? "Breed unknown"})</p>
                                    <p><strong>Program:</strong> {booking.trainingProgram?.name ?? "Unknown"}</p>
                                    <p><strong>Date:</strong> {booking.bookingDate}</p>
                                    <p><strong>Status:</strong> {booking.status ?? "Unknown"}</p>
                                    {booking.status === "PENDING" && (
                                        <div className="admin-actions">
                                            <button onClick={() => updateStatus(booking.id, "CONFIRMED")}>Confirm</button>
                                            <button onClick={() => updateStatus(booking.id, "CANCELLED")}>Cancel</button>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
