import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageEnrollments = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");
  const enrollmentsPerPage = 10;

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/enrollment-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch {
      toast.error("Failed to fetch requests");
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/enrollment-requests/${id}`,
        {
          status: decision,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Request ${decision}`);
      fetchRequests();
    } catch {
      toast.error("Failed to update request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Calculate pagination data
  const totalPages = Math.ceil(requests.length / enrollmentsPerPage);
  const startIndex = (currentPage - 1) * enrollmentsPerPage;
  const currentRequest = requests.slice(
    startIndex,
    startIndex + enrollmentsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="container">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Email</th>
              <th>Club & Categories</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequest.map((req, index) => (
              <tr key={req._id}>
                <td>{startIndex + index + 1}</td>
                <td>{req.student?.name}</td>
                <td>{req.student?.email}</td>
                <td>
                  <ul className="mb-0 ps-3">
                    <li>
                      <strong>{req.club?.name || "Unknown Club"}</strong>
                      <br />
                      <small className="text-muted">
                        Category: {req.category || "N/A"}
                      </small>
                    </li>
                  </ul>
                </td>
                <td>{req.status}</td>
                <td>
                  {req.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleDecision(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDecision(req._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo; Previous
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next &raquo;
        </button>
      </div>
    </>
  );
};

export default ManageEnrollments;
