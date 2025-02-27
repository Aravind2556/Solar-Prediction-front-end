import React, { useEffect, useState } from "react";
import LiveChart from './LiveChart';
import LoadingPage from "./Laoding";

export const Dashboard = () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [lightLevel, setLightLevel] = useState(null);
    const [solarVoltage, setSolarVoltage] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);

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

    const fetchData = async () => {
        const url = "https://api.thingspeak.com/channels/2830467/feeds.json?api_key=CY6O3R3DVLDLEQEP";
        try {
            const res = await fetch(url);
            const data = await res.json();

            console.log("Fetched data:", data);

            if (data && data.feeds && data.feeds.length > 0) {
                const filteredFeeds = data.feeds.filter(feed => {
                    const feedDate = new Date(feed.created_at);
                    return (
                        feedDate.getFullYear() === currentYear &&
                        feedDate.getMonth() === currentMonth
                    );
                });

                console.log("Filtered feeds:", filteredFeeds);

                if (filteredFeeds.length > 0) {
                    const xAxis = filteredFeeds.map(feed => new Date(feed.created_at).getTime());

                    setTemperature({
                        "x-axis": xAxis,
                        "y-axis": filteredFeeds.map(feed => feed.field1),
                        color: "black",
                        seriesName: 'Temperature'
                    });

                    setHumidity({
                        "x-axis": xAxis,
                        "y-axis": filteredFeeds.map(feed => feed.field2),
                        color: "blue",
                        seriesName: 'Humidity'
                    });

                    setLightLevel({
                        "x-axis": xAxis,
                        "y-axis": filteredFeeds.map(feed => feed.field3),
                        color: "#ffdd00",
                        seriesName: 'Light Level'
                    });

                    setSolarVoltage({
                        "x-axis": xAxis,
                        "y-axis": filteredFeeds.map(feed => feed.field4),
                        color: "green",
                        seriesName: 'Solar Voltage'
                    });

                    setWindSpeed({
                        "x-axis": xAxis,
                        "y-axis": filteredFeeds.map(feed => feed.field5),
                        color: "red",
                        seriesName: 'Wind Speed'
                    });
                } else {
                    // No data available for the selected month
                    setTemperature({ seriesName: 'Temperature', noData: true });
                    setHumidity({ seriesName: 'Humidity', noData: true });
                    setLightLevel({ seriesName: 'Light Level', noData: true });
                    setSolarVoltage({ seriesName: 'Solar Voltage', noData: true });
                    setWindSpeed({ seriesName: 'Wind Speed', noData: true });
                }
            }
        } catch (err) {
            console.error("Error in fetching from ThingSpeak:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentMonth, currentYear]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prevYear => prevYear - 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prevYear => prevYear + 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth + 1);
        }
    };

    if (!temperature || !humidity || !lightLevel || !solarVoltage || !windSpeed) {
        return <LoadingPage/>
    }

    return (
        <div className="container">
            <h1 className="text-center text-primary my-3 fs-2">Solar Prediction Dashboard</h1>

            <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center my-3">
                <button className="btn btn-outline-primary" onClick={handlePrevMonth} title="Previous month">Prev</button>
                <span className="text-primary p-2 fw-bolder">{monthNames[currentMonth]} {currentYear}</span>
                <button className="btn btn-outline-primary" onClick={handleNextMonth} title="Next month">Next</button>
            </div>

            {/* Charts Section */}
            <div className="charts d-flex flex-wrap justify-content-around gap-2">
                {
                    [temperature, humidity, lightLevel, solarVoltage, windSpeed].map((chartData, i) => (
                        <div className="col-11 col-md-10 col-lg-5 col-xl-5 m-2 border rounded" key={i} style={{ marginBottom: "20px" }}>
                            {chartData.noData ? (
                                <div className="text-center p-4">
                                    <h5 className="text-danger">{chartData.seriesName}</h5>
                                    <p>No records available for {monthNames[currentMonth]} {currentYear}</p>
                                </div>
                            ) : (
                                <LiveChart
                                    data={[chartData]}
                                    title={chartData.seriesName}
                                    lineStyle={'straight'}
                                    lineWidth={1}
                                    chartType={'line'}
                                    controls={controls}
                                />
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
