import React,{useEffect, useState} from 'react';
import { FormControl, MenuItem, Select,InputLabel,Card,CardContent } from '@material-ui/core';
import './App.css'
import Infobox from './components/InfoBox/InfoBox';
import Maap from './components/map/Maap';
import Table from './components/Table/Table';
import Graph from './components/graph/Graph';
import { sortData } from './utilities';
import "leaflet/dist/leaflet.css";

const App = () => {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);

  const [mapCenter,setMapCenter]=useState({
      lat:20.5937,
      lng:78.9629
  });
  console.log("map center",mapCenter)
  const [mapZoom,setZoom]=useState(7)
  console.log("zoom: ", mapZoom)

  const [mapCountries,setMapCountries]=useState([])

  useEffect(()=>{
      const getCounteriesData= async ()=>{

        await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response)=>response.json())
        .then((data)=>{
          // console.log(data)
          const countries=data.map((country)=>(
            {
              name:country.country,
              value:country.countryInfo.iso2
            }
          ));
          const sortedData=sortData(data);
          setTableData(sortedData)
          setCountries(countries);
          setMapCountries(data);
        })
        .catch((error)=>{
            console.log("error: ",error)
        })
      }

      getCounteriesData();

  },[])

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
    .catch(err=> console.log("error: ", err))
  },[])



  const onCountryChange= async(event)=>{
    const countryCode=event.target.value;

      const url= countryCode === "wordlwide" ? `https://disease.sh/v3/covid-19/all` : `https://disease.sh/v3/covid-19/countries/${countryCode}`
      await fetch(url)
      .then(response=> response.json())
      .then(data=>{
        setCountry(countryCode)
        setCountryInfo(data);
        const center={
          lat:data.countryInfo.lat,
          lng:data.countryInfo.long
        }
        setMapCenter(center)
        setZoom(8);
      });
    };
    // console.log("country indo: ",countryInfo)

  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
        <h1>corona tracker</h1>
          <FormControl className="app__dropdown">
            <Select value={country} variant="outlined" onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>

          </FormControl>
        </div>
        {/* Header */}
        {/* Title + select input field */}
        {/* done */}

        <div className="app__stats">
        {/* Info Boxs */}
        <Infobox 
          title="Coranavirus Cases" 
          cases={countryInfo.todayCases} 
          total={countryInfo.cases}
        />

        <Infobox 
          title="Recovered" 
          cases={countryInfo.todayRecovered} 
          total={countryInfo.recovered}
        />

        <Infobox 
          title="Deaths" 
          cases={countryInfo.todayDeaths} 
          total={countryInfo.deaths} 
        />

        </div>
        {/* Map */}
        <Maap countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>world new cases</h3>
        {/* Graph */}
        <h2>I am a Graph</h2>
        <Graph />
        </CardContent>
        {/* Table */}

      </Card>
    </div>
  );
}

export default App;

