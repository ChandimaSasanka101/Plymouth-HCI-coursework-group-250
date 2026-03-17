import React, { useEffect, useState } from "react";
import { UserManagementAPI } from "../services/userManagementAPI";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import "./AdminHome.css";

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
    <>
      <TopNav />

      <div className="admin-home-page">
        <header className="admin-home-header">
          <div>
            <p className="admin-home-eyebrow">ADMIN PANEL</p>
            <h1>Admin Dashboard</h1>
            <p>Track daily registration activity and manage platform users.</p>
          </div>

          {/* <button onClick={goToUserManagement} className="admin-manage-users-btn">
            Manage Users
          </button> */}
          
        </header>

        <div className="admin-chart-card">
          <h3>New User Registrations (Daily)</h3>

          <div className="admin-chart-wrap">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(193, 183, 184, 0.16)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#b9afb0" }}
                    axisLine={{ stroke: "rgba(193, 183, 184, 0.28)" }}
                    tickLine={{ stroke: "rgba(193, 183, 184, 0.28)" }}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#b9afb0" }}
                    axisLine={{ stroke: "rgba(193, 183, 184, 0.28)" }}
                    tickLine={{ stroke: "rgba(193, 183, 184, 0.28)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid rgba(193, 183, 184, 0.25)",
                      backgroundColor: "rgba(16, 16, 16, 0.95)",
                      color: "#c1b7b8",
                    }}
                    labelStyle={{ color: "#ded2d3" }}
                  />
                  <Bar
                    dataKey="NewUsers"
                    fill="#c1b7b8"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="admin-empty-state">No user data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
