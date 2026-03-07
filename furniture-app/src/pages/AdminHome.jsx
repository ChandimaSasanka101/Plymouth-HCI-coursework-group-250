import React, { useEffect, useState } from "react";
import { UserManagementAPI } from "../services/userManagementAPI";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function AdminHome() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const goToUserManagement = () => {
    navigate("/userManagement");
  };

  useEffect(() => {
    // Fetch data when component loads
    const fetchStats = async () => {
      try {
        const response = await UserManagementAPI.getUserStats();
        console.log("Data sent: ", response);
        const formattedData = response.map((item) => ({
          date: item._id,
          NewUsers: item.count,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Admin Dashboard</h1>
        <button
          onClick={goToUserManagement}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Manage Users
        </button>
      </header>

      {/* Chart Container Card */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#555" }}>
          New User Registrations (Daily)
        </h3>

        <div style={{ width: "100%", height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return `${date.getMonth() + 1}/${date.getDate()}`; // Shows M/D
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "5px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <Bar
                  dataKey="NewUsers"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p
              style={{ textAlign: "center", color: "#888", marginTop: "100px" }}
            >
              No user data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
