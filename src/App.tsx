import React from 'react';
import './App.css';
import { Dropdown } from 'semantic-ui-react'

import useFetch, {LoaderStatus} from './hooks/useFetch';
import {usePosition} from './hooks/useGeoPosition';

type Cloud = {
  cloud_description: string;
  cloud_name: string;
  geo_latitude:number;
  geo_longitude: number;
  geo_region:string;
}

type Error = {
  error: string;
};

type ResponseData = {
  clouds:Cloud[];
  errors:Error[];
  message:string;
  more_info:string;
  status:number;
};

const cloudProviderOptions = [
    {
        name:"AWS",
        value:"aws"
    },
    {
        name:"Microsoft Azure",
        value: "azure"
    },
    {
        name:"Google Cloud",
        value:"google"
    },
    {
        name:"Digital Ocean",
        value:"digital-ocean"
    }
];




const App = () => {

    const [response] = useFetch<ResponseData>('https://api.aiven.io/v1/clouds');
    const [coordinates, geolocationError] = usePosition();

    return(
        <div>
            <Dropdown inline options={cloudProviderOptions} defaultValue={cloudProviderOptions[0].value}/>
        </div>

    )
}
export default App;
