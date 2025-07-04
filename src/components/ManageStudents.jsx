import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data);
    } catch {
      toast.error("Failed to fetch student data");
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered mt-3">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Year</th>
              <th>Enrolled Clubs & Categories</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>
                  {student.enrolledClubs.length > 0 ? (
                    <ul className="mb-0 ps-3">
                      {student.enrolledClubs.map((enrolled, idx) => (
                        <li key={enrolled.club?._id || idx}>
                          <strong>
                            {enrolled.club?.name || "Unknown Club"}
                          </strong>
                          <br />
                          <small className="text-muted">
                            Category: {enrolled.category || "N/A"}
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;
