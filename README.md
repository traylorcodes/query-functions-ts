# query-functions-ts
Querying functions for use in the Living Atlas team's applications


This module provides various functions that will be used for development in the applications that belong to the Living Atlas team.
They will provide quick access to various bits of data- from housing, to population, etc.

## Use
To use this library, install it in your application using the command
 ```npm i query-functions-ts```

## Available Functions

### getPopulationData
Retrieves population data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for. Either a county FIPS code or a geometry must be provided for this function to retrieve data.

Currently consumes 3 parameters:

**countyFIPS**: a string value of a county FIPS code to retrieve population data for.

**geometry**: An object containing geometry information to query with. The object should contain:
- **spatialReference**: a numerical value of a Spatial Reference Wkid
- **x**: a numerical x value number
- **y**: a numerical y value number

**token**: An optional token to provide for use with services that are protected.

---------
Returns an array of objects containing the key value pairs:
- **P0010001**: number
- **P0020002**: number
- **P0020003**: number

```ts
import { getPopulationData } from 'query-functions-ts'

// get population data by providing a county FIPS code
getPopulationData('27137', undefined, token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});

// get population data by providing a geometry
getPopulationData(undefined,
 {
    spatialReference: 102100,
    x: -10261987.88099638,
    y: 5903130.124037775
 },
  token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});
```

### getHousingData
Retrieves housing data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for. Either a county FIPS code or a geometry must be provided for this function to retrieve data.

Currently consumes 3 parameters:

**countyFIPS**: a string value of a county FIPS code to retrieve housing data for.

**geometry**: An object containing geometry information to query with. The object should contain:
- **spatialReference**: a numerical value of a Spatial Reference Wkid
- **x**: a numerical x value number
- **y**: a numerical y value number

**token**: An optional token to provide for use with services that are protected.

```ts
import { getHousingData } from 'query-functions-ts'

// get population data by providing a county FIPS code
getHousingData('27137', undefined, token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});

// get population data by providing a geometry
getHousingData(undefined,
 {
    spatialReference: 102100,
    x: -10261987.88099638,
    y: 5903130.124037775
 },
  token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});
```

### getWaterAndLandArea
Retrieves water and land area data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for. Either a county FIPS code or a geometry must be provided for this function to retrieve data.

Currently consumes 3 parameters:

**countyFIPS**: a string value of a county FIPS code to retrieve land and water area data for.

**geometry**: An object containing geometry information to query with. The object should contain:
- **spatialReference**: a numerical value of a Spatial Reference Wkid
- **x**: a numerical x value number
- **y**: a numerical y value number

**token**: An optional token to provide for use with services that are protected.

```ts
import { getWaterAndLandArea } from 'query-functions-ts'

// get population data by providing a county FIPS code
getWaterAndLandArea('27137', undefined, token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});

// get population data by providing a geometry
getWaterAndLandArea(undefined,
 {
    spatialReference: 102100,
    x: -10261987.88099638,
    y: 5903130.124037775
 },
  token)
.then((response) => {
    // handleResponse(response);
})
.catch((e) => {
    // handleError(e);
});
```