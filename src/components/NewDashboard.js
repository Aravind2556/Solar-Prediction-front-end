import React, { useEffect, useState } from "react";
import LiveChart from './LiveChart'

export const Dashboard = () => {

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

        const fields = [
            { key: "field1", name: "Temperature", color: "black" },
            { key: "field2", name: "Humidity", color: "blue" },
            { key: "field3", name: "Light Level", color: "yellow" },
            { key: "field4", name: "Solar Voltage", color: "green" },
            { key: "field5", name: "Wind Speed", color: "red" }
        ]

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
      <h1 className="text-center text-primary my-3">Solar Prediction Dashboard</h1>

      

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

      
        {/* <div className="col-11 col-md-10 col-lg-5 col-xl-3 m-2 border rounded" key={index} style={{ marginBottom: "20px" }}>
            <h3 className="bg-primary text-light rounded-top p-2">{chart.name}</h3>
            <div className="px-2">
            <ApexCharts
                options={chart.options}
                series={[{ name: chart.name, data: chart.data }]}
                type="line"
                height={300}
            />
            </div>
        </div> */}

      </div>
    </div>
  );
};



