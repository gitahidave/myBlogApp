import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Help = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendLink = useSelector((state) => state.prod.link);

  const faqs = [
    {
      id: "faqOne",
      question: "How do I read a blog?",
      answer:
        'Simply click on any blog card or the "Read More" button to view the full article details.',
    },
    {
      id: "faqTwo",
      question: "Can I save blogs for later?",
      answer:
        "Yes, you can use the favorite or bookmark feature (if logged in) to save blogs for future reading.",
    },
    {
      id: "faqThree",
      question: "How do I manage my account?",
      answer:
        'Go to the "Manage Account" or Profile section from your dashboard sidebar to update your personal details.',
    },
    {
      id: "faqFour",
      question: "I can’t access a blog. What should I do?",
      answer:
        "Try refreshing the page or checking your internet connection. If the issue persists, send a message to support using the form below.",
    },
  ];

  const handleSupportSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.warning("Please fill out both subject and message fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendLink}/api/support/contact`,
        { subject, message },
        { withCredentials: true }
      );

      if (response.data?.success !== false) {
        toast.success(
          response.data?.message || "Support message sent successfully!"
        );
        setSubject("");
        setMessage("");
      } else {
        toast.error(response.data?.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while sending your support ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Help & Support</h2>
        <p className="text-muted">
          Find answers to common questions or reach out to our team directly.
        </p>
      </div>

      {/* Accordion FAQs */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-semibold mb-4">Frequently Asked Questions</h5>

        <div className="accordion accordion-flush" id="faqAccordion">
          {faqs.map((faq, index) => (
            <div className="accordion-item border-bottom" key={faq.id}>
              <h2 className="accordion-header" id={`heading-${faq.id}`}>
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  } fw-semibold text-dark shadow-none px-0`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${faq.id}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`collapse-${faq.id}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse-${faq.id}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={`heading-${faq.id}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted px-0 pt-0 pb-3">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-semibold mb-3">Contact Support</h5>
        <form onSubmit={handleSupportSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Subject</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Message</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Describe your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Help;