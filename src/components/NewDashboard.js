import React, { useEffect, useState } from "react";
import LiveChart from './LiveChart'

export const Dashboard = () => {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear()

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const [temperature, setTemperature] = useState(null)
    const [humidity, setHumidity] = useState(null)
    const [lightLevel, setLightLevel] = useState(null)
    const [solarVoltage, setSolarVoltage] = useState(null)
    const [windSpeed, setWindSpeed] = useState(null)

    const controls = {
        show: true,
        download: true,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        zoomEnabled: true,
        autoSelected: 'zoom'
    };

  useEffect(() => {
    const fetchData = async () => {

        const url = "https://api.thingspeak.com/channels/2830467/feeds.json?api_key=CY6O3R3DVLDLEQEP";


        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            console.log("data:", data)

            if(data && data.feeds && data.feeds.length>0){
                const xAxis = data.feeds.map(feed=>new Date(feed.created_at).getTime())

                setTemperature({
                    "x-axis": xAxis,
                    "y-axis": data.feeds.map(feed=>feed.field1),
                    color: "black",
                    seriesName: 'Temperature'
                })

                setHumidity({
                    "x-axis": xAxis,
                    "y-axis": data.feeds.map(feed=>feed.field2),
                    color: "blue",
                    seriesName: 'Humidity'
                })

                setLightLevel({
                    "x-axis": xAxis,
                    "y-axis": data.feeds.map(feed=>feed.field3),
                    color: "yellow",
                    seriesName: 'Light Level'
                })

                setSolarVoltage({
                    "x-axis": xAxis,
                    "y-axis": data.feeds.map(feed=>feed.field4),
                    color: "green",
                    seriesName: 'Solar Voltage'
                })

                setWindSpeed({
                    "x-axis": xAxis,
                    "y-axis": data.feeds.map(feed=>feed.field5),
                    color: "red",
                    seriesName: 'Wind Speed'
                })
            }

        })
        .catch(err=>{
            console.log("Error in fetching from Thinkspeak:",err)
        })

    };

    fetchData();

    // Optionally, set up polling for live data updates (e.g., every 30 seconds)
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);




  if(!temperature || !humidity || !lightLevel || !solarVoltage || !windSpeed){
    return <div>Loading...</div>
  }

  return (
    <div className="container">
      <h1 className="text-center text-primary my-3 fs-2">Solar Prediction Dashboard</h1>

      <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center my-3">
        <button className="btn btn-outline-primary" onClick={()=>{}} title="Previous month">Prev</button>
        <span className="text-primary p-2 fw-bolder">{monthNames[currentMonth]}</span>
        <button className="btn btn-outline-primary" onClick={()=>{}} title="Next month">Next</button>
      </div>

      

      {/* Charts Section */}
      <div className="charts d-flex flex-wrap justify-content-around gap-2">

        {
            [temperature, humidity, lightLevel, solarVoltage, windSpeed].map((chartData, i)=>{
                return(
                    <div className="col-11 col-md-10 col-lg-5 col-xl-5 m-2 border rounded" key={i} style={{ marginBottom: "20px" }}>
                        <LiveChart data={[chartData]} title={chartData.seriesName} lineStyle={'straight'} lineWidth={1} chartType={'line'} controls={controls} />
                    </div>
                )
            })
        }

      </div>
    </div>
  );
};



