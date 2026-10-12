
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function App() {
    const [programs, setPrograms] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedDog, setSelectedDog] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/training-programs`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load programs");
                }
                return response.json();
            })
            .then(setPrograms)
            .catch(() => {
                setMessage(
                    "Could not load programs. Check that the backend is running."
                );
            });

        fetch(`${API_URL}/dogs`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load dogs");
                }
                return response.json();
            })
            .then(setDogs)
            .catch((error) => {
                console.error("Could not load dogs:", error);
            });
    }, []);

    function openBooking(program) {
        setSelectedProgram(program);
        setSelectedDog("");
        setBookingDate("");
        setMessage("");

        setTimeout(() => {
            document.getElementById("booking")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100);
    }

    async function handleBooking(event) {
        event.preventDefault();
        setMessage("");

        if (!selectedDog || !bookingDate || !selectedProgram) {
            setMessage("Please choose a dog and booking date.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dog: { id: Number(selectedDog) },
                    trainingProgram: { id: selectedProgram.id },
                    bookingDate,
                    status: "PENDING",
                }),
            });

            if (!response.ok) {
                throw new Error("Booking request failed");
            }

            setMessage(
                "Booking submitted successfully! Your booking is pending approval. 🐾"
            );
            setBookingDate("");
            setSelectedDog("");
        } catch (error) {
            console.error("Booking error:", error);
            setMessage(
                "Booking failed. Please check that the backend is running and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app">
            <nav className="navbar">
                <a className="logo" href="#home">
                    🐾 PawTrain
                </a>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#programs">Training</a>
                    <a href="#about">About</a>
                    <a href="#admin-bookings">Admin</a>

                    <button
                        onClick={() =>
                            document.getElementById("programs")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <main>
                <section className="hero" id="home">
                    <div className="hero-text">
                        <p className="small-title">
                            PROFESSIONAL DOG TRAINING
                        </p>

                        <h1>
                            Build a better bond with your{" "}
                            <span>best friend.</span>
                        </h1>

                        <p className="hero-description">
                            Find the right training program for your dog, from
                            basic obedience to good household manners.
                        </p>

                        <button
                            className="hero-button"
                            onClick={() =>
                                document.getElementById("programs")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Explore Training
                        </button>
                    </div>

                    <div className="hero-dog" aria-label="Dog">
                        🐕
                    </div>
                </section>

                <section className="program-section" id="programs">
                    <p className="small-title">OUR PROGRAMS</p>

                    <h2>Training made for every dog</h2>

                    <p className="section-description">
                        Choose a program based on your dog's needs and goals.
                    </p>

                    {programs.length === 0 ? (
                        <p>No training programs to display yet.</p>
                    ) : (
                        <div className="program-grid">
                            {programs.map((program) => (
                                <article
                                    className="program-card"
                                    key={program.id}
                                >
                                    <div className="card-icon">🐾</div>
                                    <h3>{program.name}</h3>
                                    <p>{program.description}</p>

                                    <div className="program-info">
                                        <strong>₹{program.price}</strong>
                                        <span>
                                            {program.durationWeeks} weeks
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => openBooking(program)}
                                    >
                                        Choose Program
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}

                    {message && !selectedProgram && (
                        <p className="status-message" role="status">
                            {message}
                        </p>
                    )}

                    {selectedProgram && (
                        <form
                            className="booking-form"
                            id="booking"
                            onSubmit={handleBooking}
                        >
                            <p className="small-title">LET'S GET STARTED</p>

                            <h2>Book {selectedProgram.name}</h2>

                            <p>
                                Choose your dog and preferred booking date.
                            </p>

                            <label htmlFor="dog">Your dog</label>

                            <select
                                id="dog"
                                value={selectedDog}
                                onChange={(event) =>
                                    setSelectedDog(event.target.value)
                                }
                                required
                            >
                                <option value="">Select a dog</option>

                                {dogs.map((dog) => (
                                    <option key={dog.id} value={dog.id}>
                                        {dog.name} — {dog.breed}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="bookingDate">
                                Booking date
                            </label>

                            <input
                                id="bookingDate"
                                type="date"
                                value={bookingDate}
                                min={new Date().toLocaleDateString("en-CA")}
                                onChange={(event) =>
                                    setBookingDate(event.target.value)
                                }
                                required
                            />

                            <button
                                className="hero-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Booking..." : "Confirm Booking"}
                            </button>

                            {message && (
                                <p className="status-message" role="status">
                                    {message}
                                </p>
                            )}
                        </form>
                    )}
                </section>

                <section className="about-section" id="about">
                    <div>
                        <p className="small-title">WHY PAWTRAIN?</p>

                        <h2>
                            Better training.
                            <br />
                            Happier dogs.
                        </h2>
                    </div>

                    <div className="features">
                        <article>
                            <span>🐶</span>
                            <h3>Dog-focused</h3>
                            <p>
                                Training designed around your dog's
                                individual needs.
                            </p>
                        </article>

                        <article>
                            <span>🏆</span>
                            <h3>Professional</h3>
                            <p>
                                Structured programs that support consistent
                                progress.
                            </p>
                        </article>

                        <article>
                            <span>❤️</span>
                            <h3>Better Bond</h3>
                            <p>
                                Build trust and a stronger relationship with
                                your dog.
                            </p>
                        </article>
                    </div>
                </section>

                <section
                    className="program-section"
                    id="admin-bookings"
                >
                    <p className="small-title">ADMIN PANEL</p>

                    <h2>Manage Training Bookings</h2>

                    <p className="section-description">
                        Review bookings and update their status.
                    </p>

                    <AdminBookings />
                </section>
            </main>

            <footer>
                <div className="logo">🐾 PawTrain</div>
                <p>Helping dogs become their best selves.</p>
                <p>© 2026 PawTrain</p>
            </footer>
        </div>
    );
}

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [username, setUsername] = useState("raax");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    function getAuthHeaders() {
        return {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            "Content-Type": "application/json",
        };
    }

    async function handleLogin(event) {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error("Incorrect admin username or password.");
            }

            if (!response.ok) {
                throw new Error(
                    "Could not load bookings. Check that the backend is running."
                );
            }

            const data = await response.json();
            setBookings(data);
            setIsLoggedIn(true);
            setMessage("");
        } catch (error) {
            console.error("Admin login error:", error);
            setMessage(
                error.message ||
                "Login failed. Please check the backend connection."
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadBookings() {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                headers: getAuthHeaders(),
            });

            if (response.status === 401 || response.status === 403) {
                setIsLoggedIn(false);
                throw new Error(
                    "Your admin session was rejected. Please log in again."
                );
            }

            if (!response.ok) {
                throw new Error("Could not load bookings.");
            }

            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Loading bookings error:", error);
            setMessage(error.message || "Could not load bookings.");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, status) {
        setUpdatingId(id);
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/bookings/${id}/status`,
                {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ status }),
                }
            );

            if (response.status === 401 || response.status === 403) {
                setIsLoggedIn(false);
                throw new Error(
                    "Admin authentication failed. Please log in again."
                );
            }

            if (!response.ok) {
                throw new Error("Could not update booking status.");
            }

            setMessage(`Booking #${id} updated to ${status}.`);
            await loadBookings();
        } catch (error) {
            console.error("Updating booking error:", error);
            setMessage(
                error.message || "Could not update status. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function handleLogout() {
        setIsLoggedIn(false);
        setPassword("");
        setBookings([]);
        setMessage("");
    }

    return (
        <div className="admin-bookings">
            {!isLoggedIn ? (
                <form className="booking-form" onSubmit={handleLogin}>
                    <h3>Admin Login</h3>

                    <p>Log in to review and manage training bookings.</p>

                    <label htmlFor="adminUsername">Username</label>
                    <input
                        id="adminUsername"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                    />

                    <label htmlFor="adminPassword">Password</label>
                    <input
                        id="adminPassword"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    {message && (
                        <p className="status-message" role="alert">
                            {message}
                        </p>
                    )}

                    <button
                        className="hero-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            ) : (
                <>
                    <div className="admin-actions">
                        <button
                            onClick={loadBookings}
                            disabled={loading || updatingId !== null}
                        >
                            {loading ? "Loading..." : "Refresh Bookings"}
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={loading || updatingId !== null}
                        >
                            Log Out
                        </button>
                    </div>

                    {message && (
                        <p className="status-message" role="status">
                            {message}
                        </p>
                    )}

                    {loading ? (
                        <p>Loading bookings...</p>
                    ) : bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        <div className="program-grid">
                            {bookings.map((booking) => (
                                <article
                                    className="program-card"
                                    key={booking.id}
                                >
                                    <h3>Booking #{booking.id}</h3>

                                    <p>
                                        <strong>Dog:</strong>{" "}
                                        {booking.dog?.name ?? "Unknown"}
                                    </p>

                                    <p>
                                        <strong>Program:</strong>{" "}
                                        {booking.trainingProgram?.name ??
                                            "Unknown"}
                                    </p>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {booking.bookingDate}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {booking.status ?? "Unknown"}
                                    </p>

                                    {booking.status === "PENDING" && (
                                        <div className="admin-actions">
                                            <button
                                                disabled={updatingId !== null}
                                                onClick={() =>
                                                    updateStatus(
                                                        booking.id,
                                                        "CONFIRMED"
                                                    )
                                                }
                                            >
                                                {updatingId === booking.id
                                                    ? "Updating..."
                                                    : "Confirm"}
                                            </button>

                                            <button
                                                disabled={updatingId !== null}
                                                onClick={() =>
                                                    updateStatus(
                                                        booking.id,
                                                        "CANCELLED"
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>
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
