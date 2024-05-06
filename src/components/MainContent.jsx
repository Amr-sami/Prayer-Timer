import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import moment from 'moment-timezone'; // Import moment-timezone instead of moment
import "moment/dist/locale/ar-dz";
moment.locale("ar-dz");

import fajrPrayerImage from '../assets/fajr-prayer.png'; 
import duhurPrayerImage from '../assets/dhhr-prayer-mosque.png'; 
import asrPrayerImage from '../assets/asr-prayer-mosque.png'; 
import maghribPrayerImage from '../assets/sunset-prayer-mosque.png'; 
import ishaaPrayerImage from '../assets/night-prayer-mosque.png'; 

export default function MainContent() {
    
    const cities = [
        { displayName: "مكة", apiName: "Makkah al Mukarramah", timezone: "Asia/Riyadh" }, // Saudi Arabia - Riyadh
        { displayName: "الرياض", apiName: "Riyadh", timezone: "Asia/Riyadh" }, // Saudi Arabia - Riyadh
        { displayName: "دبي", apiName: "Dubai", timezone: "Asia/Dubai" }, // United Arab Emirates - Dubai
        { displayName: "القاهرة", apiName: "Cairo", timezone: "Africa/Cairo" }, // Egypt - Cairo
        { displayName: "الدوحة", apiName: "Doha", timezone: "Asia/Qatar" }, // Qatar - Doha
        { displayName: "طرابلس", apiName: "Tripoli", timezone: "Africa/Tripoli" }, // Libya - Tripoli
        { displayName: "تونس", apiName: "Tunis", timezone: "Africa/Tunis" }, // Tunisia - Tunis
        { displayName: "الجزائر", apiName: "Algiers", timezone: "Africa/Algiers" }, // Algeria - Algiers
        { displayName: "بغداد", apiName: "Baghdad", timezone: "Asia/Baghdad" }, // Iraq - Baghdad
        { displayName: "بيروت", apiName: "Beirut", timezone: "Asia/Beirut" }, // Lebanon - Beirut
        { displayName: "عمان", apiName: "Muscat", timezone: "Asia/Muscat" }, // Oman - Muscat
        { displayName: "الخرطوم", apiName: "Khartoum", timezone: "Africa/Khartoum" }, // Sudan - Khartoum
        { displayName: "صنعاء", apiName: "Sana'a", timezone: "Asia/Aden" }, // Yemen - Sana'a
        { displayName: "الرباط", apiName: "Rabat", timezone: "Africa/Casablanca" }, // Morocco - Rabat
    ];
    
    const prayers = [
        {key :"Fajr" , displayName : "الفجر"},
        {key :"Dhuhr" , displayName : "الضهر"},
        {key :"Asr" , displayName : "العصر"},
        {key :"Maghrib" , displayName : "المغرب"},
        {key :"Isha" , displayName : "العشاء"}
    ]

    const [timings, setTimings] = useState({
        "Fajr": "04:16",
        "Dhuhr": "12:19",
        "Asr": "15:43",
        "Maghrib": "18:54",
        "Isha": "20:15",
    });
    const [backgroundImage, setBackgroundImage] = useState('');

    const [nextPrayerIndex,setNextPrayerIndex] = useState(2);
    const [remainingTime , setRemainingTime] = useState("");
    const [city, setCity] = useState(cities[4]); 
    const [today,setToday] = useState("");
    

    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=SA`);
        setTimings(response.data.data.timings);
    }


    useEffect(() => {
        getTimings(city.apiName);
    }, [city]);

    useEffect(() => {
        let intervalId = setInterval(() => {
           setupCountTimer();
        }, 1000);
        
        const t = moment.tz(city.timezone); // Use moment.tz() to get the current time in the selected city's timezone
        setToday(t.format("MMM Do YY | h:mm"));

        return () => clearInterval(intervalId);
        
    },[timings])

    useEffect(() => {
        setBackgroundByCountry(city.displayName);
    }, [city.displayName]);

    const setupCountTimer = () => {
        const momentNow = moment();
        let prayerIndex = 2;
    
        // Iterate through each prayer to find the next one
        for (let i = 0; i < prayers.length; i++) {
            const currentPrayerTime = moment(timings[prayers[i].key], "HH:mm");
    
            // Check if the current time is after the current prayer time and before the next one
            if (
                momentNow.isAfter(currentPrayerTime) &&
                momentNow.isBefore(moment(timings[prayers[i + 1].key], "HH:mm"))
            ) {
                prayerIndex = i + 1;
                break;
            }
        }
    
        // If the current time is after Isha (last prayer), set the next prayer to Fajr (first prayer)
        if (momentNow.isAfter(moment(timings.Isha, "HH:mm"))) {
            prayerIndex = 0;
        }
    
        // Update the state with the index of the next prayer
        setNextPrayerIndex(prayerIndex);
    
        // Get the time of the next prayer
        const nextPrayerTime = moment(timings[prayers[prayerIndex].key], "HH:mm");
    
        // Calculate the remaining time until the next prayer
        let remainingTime = nextPrayerTime.diff(momentNow);
    
        // If the remaining time is negative, it means the next prayer is tomorrow
        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "HH:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = moment(timings[prayers[0].key], "HH:mm").diff(moment("00:00:00", "HH:mm:ss"));
            remainingTime = midnightDiff + fajrToMidnightDiff;
        }
    
        // Convert remaining time to duration
        const durationRemainingTime = moment.duration(remainingTime);
    
        // Format hours, minutes, and seconds with leading zeros if they are less than 10
        const formattedHours = durationRemainingTime.hours().toString().padStart(2, '0');
        const formattedMinutes = durationRemainingTime.minutes().toString().padStart(2, '0');
        const formattedSeconds = durationRemainingTime.seconds().toString().padStart(2, '0');
    
        // Update the state with the remaining time
        setRemainingTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    };
    
    const handleCityChange = (event) => {
        const cityObject = cities.find((city)=>{
            return city.apiName === event.target.value;
        })
        setCity(cityObject);
    }

    const setBackgroundByCountry = (country) => {
        switch (country) {
            case 'مكة':
                setBackgroundImage('https://images.unsplash.com/photo-1591604157118-b94e2684f857?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFra2FofGVufDB8MHwwfHx8MA%3D%3D');
                break;
            case 'الرياض':
                setBackgroundImage('https://images.unsplash.com/photo-1609321599814-e3a55183568d?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'دبي':
                setBackgroundImage('https://images.unsplash.com/photo-1663690114827-98a5eb44eb3c?q=80&w=2966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'القاهرة':
                setBackgroundImage('https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'الدوحة':
                setBackgroundImage('https://images.unsplash.com/photo-1666352970456-c95c0c672e92?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'طرابلس':
                setBackgroundImage('https://images.unsplash.com/photo-1588889802078-67ce0634a6a3?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'تونس':
                setBackgroundImage('https://images.unsplash.com/photo-1554018411-362847d4da0d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'الجزائر':
                setBackgroundImage('https://images.unsplash.com/photo-1602496252172-8030f4df6ed0?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'بغداد':
                setBackgroundImage('https://images.unsplash.com/photo-1629489616955-6b6467279ab6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'بيروت':
                setBackgroundImage('https://images.unsplash.com/photo-1596607806323-6e3708b407f7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'عمان':
                setBackgroundImage('https://images.unsplash.com/photo-1671796784555-7d8935de9773?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'الخرطوم':
                setBackgroundImage('https://images.unsplash.com/photo-1659864216522-494efbd76895?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'صنعاء':
                setBackgroundImage('https://images.unsplash.com/photo-1656416584402-b720e0d786dc?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            case 'الرباط':
                setBackgroundImage('https://images.unsplash.com/photo-1664961789336-b70397e0aa8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                break;
            default:
                setBackgroundImage('https://images.unsplash.com/photo-1663690114827-98a5eb44eb3c?q=80&w=2966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
        }
    }
    

    return (
        <div>
            {/* Dynamically change background image for the entire body */}
            <style>{`
                body {
                    background-image: url(${backgroundImage});
                    background-size: cover;
                }
            `}</style>
            {/* Main content */}
            <div style={{ width: '75%', margin: '0 auto' }}>
                {/* Top Row */}
                <Grid container >
                    <Grid xs={6}>
                        <div>
                            <h2 style={{ color: 'white' }}>{today}</h2>
                            <h1 style={{ color: 'white' }}>{city.displayName} </h1>


                        </div>
                    </Grid>
                    <Grid xs={6}>
                        <div>
                            <h2 style={{ color: 'white' }}>متبقي حتى صلاة {prayers[nextPrayerIndex].displayName}</h2>
                            <h1 style={{ color: 'white' }}> {remainingTime}</h1>
                        </div>
                    </Grid>
                </Grid>
                {/* Top Row */}
                <Divider style={{ borderBlockColor: "white", opacity: 0.1 }} />
                {/* prayers card */}
                <Stack direction={'row'} justifyContent={'space-around'} style={{ marginTop: "50px" }}>
                    <Prayer prayerName={"الفجر"} prayerTime={timings.Fajr} image={fajrPrayerImage} />
                    <Prayer prayerName={"الضهر"} prayerTime={timings.Dhuhr} image={duhurPrayerImage} />
                    <Prayer prayerName={"العصر"} prayerTime={timings.Asr} image={asrPrayerImage} />
                    <Prayer prayerName={"المغرب"} prayerTime={timings.Maghrib} image={maghribPrayerImage} />
                    <Prayer prayerName={"العشاء"} prayerTime={timings.Isha} image={ishaaPrayerImage} />
                </Stack>

                <Stack direction={'row'} justifyContent={'center'} style={{ marginTop: "50px" }}>
                    <FormControl style={{ width: "20%", paddingTop:"10px"  , display: "flex", flexDirection: "column" }}>
                    <InputLabel id="demo-simple-select-label" style={{ color: "white", marginBottom:"5px", alignSelf: "flex-end", justifyContent: "flex-end" }}>المدينة</InputLabel>
                        <Select
                            style={{ color: "white" }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={city.apiName}
                            onChange={handleCityChange}
                        >
                            {cities.map((city) => (
                                <MenuItem value={city.apiName} key={city.apiName}>
                                    {city.displayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </div>
        </div>
    );
}