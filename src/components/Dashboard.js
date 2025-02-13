import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

export const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://api.thingspeak.com/channels/2830467/feeds.json?api_key=CY6O3R3DVLDLEQEP";
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.feeds) {
          const feeds = data.feeds;
          const timestamps = feeds.map((feed) =>
            new Date(feed.created_at).toLocaleTimeString()
          );

          // Fields we want to display on the chart
          const fields = [
            { key: "field1", name: "Temperature", color: "black" },
            { key: "field2", name: "Humidity", color: "blue" },
            { key: "field3", name: "Light Level", color: "yellow" },
            { key: "field4", name: "Solar Voltage", color: "green" },
            { key: "field5", name: "Wind Speed", color: "red" }
          ];

          // Prepare data for charts
          const newChartData = fields.map((field) => {
            const values = feeds
              .map((feed) => Number(feed[field.key]))
              .filter((v) => !isNaN(v));

            // Alert handling: Checking if the values are within a range
            if (values.length > 0) {
              const latestValue = values[values.length - 1];
              if (field.name === "Temperature" && latestValue > 30) {
                setAlerts((prevAlerts) => [
                  ...prevAlerts,
                  `Temperature is too high: ${latestValue}°C`
                ]);
              }
              return {
                name: field.name,
                data: values,
                options: {
                  chart: { type: "line" },
                  xaxis: { categories: timestamps },
                  colors: [field.color]
                }
              };
            }

            console.log("")
            return null;
          }).filter(Boolean); // Remove any null entries

          setChartData(newChartData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    // Optionally, set up polling for live data updates (e.g., every 30 seconds)
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div className="container">
      <h1 className="text-center text-primary my-3">Solar Prediction Dashboard</h1>

      

      {/* Charts Section */}
      <div className="charts d-flex flex-wrap justify-content-around gap-2">
        {chartData.length > 0 ? (
          chartData.map((chart, index) => (
            <div className="col-11 col-md-10 col-lg-5 col-xl-3 m-2 border rounded" key={index} style={{ marginBottom: "20px" }}>
              <h3 className="bg-primary text-light rounded-top p-2">{chart.name}</h3>
              <div className="px-2">
                <ApexCharts
                  options={chart.options}
                  series={[{ name: chart.name, data: chart.data }]}
                  type="line"
                  height={300}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No data available for charts</p>
        )}
      </div>
    </div>
  );
};



