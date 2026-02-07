import { useState } from "react";
import API from "../api/axios";

const CreateComplaint = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/complaints", {
        title,
        description,
        category,
      });

      alert("Complaint created successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("other");

      // Refresh dashboard list
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Create New Complaint</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="other">Other</option>
          <option value="garbage">Garbage</option>
          <option value="water">Water</option>
          <option value="pothole">Pothole</option>
          <option value="electricity">Electricity</option>
          <option value="road">Road</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;
