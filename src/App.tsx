import React, {ChangeEvent, useState} from 'react';
import './App.css';

import {useFetch, LoaderStatus} from './hooks/useFetch';
import {usePosition} from './hooks/useGeoPosition';
import {haversine} from "./havershine";

type Cloud = {
    cloud_description: string;
    cloud_name: string;
    geo_latitude: number;
    geo_longitude: number;
    geo_region: string;
}

type Error = {
    error: string;
};

type ResponseData = {
    clouds: Cloud[];
    errors: Error[];
    message: string;
    more_info: string;
    status: number;
};

const cloudProviderOptions = [
    {
        text: "AWS",
        value: "aws"
    },
    {
        text: "Microsoft Azure",
        value: "azure"
    },
    {
        text: "Google Cloud",
        value: "google"
    },
    {
        text: "Digital Ocean",
        value: "do"
    },
    {
        text: "UpCloud",
        value: "upcloud",
    }
];


const App = (): JSX.Element => {
    // Get data from API using generic hook
    const [response] = useFetch<ResponseData>('https://api.aiven.io/v1/clouds');
    // Locate user's position
    const [coordinates, geolocationError] = usePosition();
    // Selection for cloud provider
    const [selection, setSelection] = useState({value:'',text:''});

    const filterByProvider = () => {
        if (response.status === LoaderStatus.Success) {
            const reducer = (acc: Cloud[], el: Cloud) => {
                if (el.cloud_name.includes(selection.value)) {
                    acc.push(el);
                };
                return acc;
            };

            return response.data.clouds.reduce(reducer, []);
        }
    };

    const filtered = filterByProvider() || [];

    const changeProvider = (e: ChangeEvent<HTMLSelectElement>) => {
        const providers = cloudProviderOptions.filter(cloud => cloud.value === e.target.value);
        setSelection(providers[0]);
    };


    const sortByLocation = () => {
        if (coordinates && filtered.length > 0) {
            const {latitude, longitude} = coordinates;

            let temporary = haversine(latitude, filtered[0].geo_latitude, longitude, filtered[0].geo_latitude);

            const reducer = (acc: Cloud[], el: Cloud) => {
                let current = haversine(latitude, el.geo_latitude, longitude, el.geo_longitude);
                if (current < temporary) {//nearest
                    temporary = current;
                    acc.push(el)
                }

                return acc;
            };

            return filtered.reduce(reducer, []);
        };
    };

    const closestProviders = sortByLocation() || [];


    return response.status === LoaderStatus.Success ?
        (<form>
                <h2>Find closest provider</h2>
                <label htmlFor="clouds">Filter by provider:</label>
                <select id="clouds" name="clouds" onChange={changeProvider}>
                    <option value="none" selected disabled hidden/>
                    {cloudProviderOptions.map((cloudProvider) =>
                        <option value={cloudProvider.value}>{cloudProvider.text}</option>
                    )}
                </select>
                {geolocationError && geolocationError.message !== null ?
                    (<div>
                        <p>{`Not able to find nearest data center to you, received an error: ${geolocationError!.message}`}</p>
                        <p>{"Select a cloud provider to see list of data centers"}</p>
                        <ul>
                            {filtered.map(cloudProvider => (<li>{cloudProvider.cloud_description}</li>))}
                        </ul>
                    </div>) : (<div>
                        <p>{'List of nearest data centers'}</p>
                        {closestProviders.reverse().map((provider) => (
                            <li>{provider.cloud_description}</li>))}
                    </div>)
                }
            </form>
        ) : (<div>Loading...</div>)

}
export default App;
