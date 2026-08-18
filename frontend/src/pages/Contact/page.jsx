import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const backendLink = useSelector((state) => state.prod.link);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.warning("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendLink}/api/contact/send-message`,
        formData,
        { withCredentials: true }
      );

      if (response.data?.success !== false) {
        toast.success(response.data?.message || "Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(response.data?.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while sending your message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          Contact <span className="text-primary">Us</span>
        </h2>
        <p className="text-muted">
          Want to leave us a message? Fill in the form below and we
          will get back to you shortly.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 p-4">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                <label htmlFor="name">Enter Your Name *</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Enter Your Email *</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="+254700000000"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <label htmlFor="phone">Enter Your Phone Number</label>
              </div>

              <div className="form-floating mb-4">
                <textarea
                  className="form-control"
                  placeholder="Leave your message here"
                  id="message"
                  style={{ height: "140px" }}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="message">Your Message *</label>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary py-3 fw-semibold rounded-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;