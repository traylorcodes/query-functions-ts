# query-functions-ts

## Use
To use this library, install it in your application using the command
 ```npm i query-functions-ts```

 This module contains the querying functions used to retrieve data in the 2024 Esri Living Atlas Drought Aware application.

 The functions retrieve data from a variety of feature services that may be reusable in multiple applications. Below is a list of functions and the data that is retrieved.

 For type definitions, see the types.d.ts file.

# Available Functions

## Utility

### generateUrlParams

Generates a URL parameter string to use for querying a service

Parameters:

- **serviceUrl**: The url of the service being queried.

- **options**: A data object of key and value pairs to append as parameters on the url.

- **queryingRelatedFeatures**: Optional. Indicate if the url directory should include "/queryRelatedFeatures" for a related query.


Returns an array of objects containing the key value pairs:

- **return**: string - a string of the complete URL with the appended parameters to execute a query on.
---

### executeQuery
Resolves or rejects a Promise by attempting to query with the URL created by the generateUrlParams function.

Parameters:

- **url**: The URL to query.

- **returnAttributesOnly**: Indicates whether or not to include the geometry of returned features.

- **resolve**: The Promise's resolve function.

- **reject**: The Promise's reject function.

- **queryingRelatedRecords**: Optional. Indicate whether or not this is a query for related records.



Returns an array of objects containing the key value pairs:
- **return**: void
---

## Drought

### retrieveListOfNationalDroughtLevelPeriods
Retrieve the time related fields for every feature that represents a week of drought data from the national-level drought history table.

Parameters:

**None**


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

### retrieveDroughtLevelData
Retrieve the drought level data for either the entire nation, a county, or a state.

Parameters:

**featureCategory**: Indicate what area type the query is for, and use the proper feature service.
**parameter**: The ID of the feature to find. Identifying field is determined by featureCategory.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

## ACS

### getPopulationServiceData
Retrieve data for a feature from an ACS population service. A feature is found by using an input point geometry to query for features with.

Parameters:

**getCountyOrStateData**: Indicate whether to use the county or state feature service.
**geometry**: The input geometry to query for features with.
**returnIdInformationData**: Indicate whether or not to return identifying information (such as a FIPS code).
**returnPopulationData**: Indicate whether or not to return configured population output fields.
**returnHousingData**: Indicate whether or not to return configured housing fields.
**returnAgricultureData**: Indicate whether or not to return configured agriculture fields.
**returnEconomicImpactData**: Indicate whether or not to return configured economic fields.
**getAgriValue**: Indicate whether or not to return the configured agricultural value field.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

## Population

### getPopulationHistory
Retrieve the historical population data for a certain area.

Parameters:

**getCountyOrStateMode**: Indicate whether to retrieve data from the county table service or the state table service.
**objectId**: The object ID of the related ACS layer feature to query for table data.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

## Agriculture

### getAgricultureHistory
Retrieve the historical agriculture data for a certain area.

Parameters:

**getCountyOrStateMode**: Indicate whether to retrieve data from the county table service or the state table service.
**objectId**: The object ID of the related ACS layer feature to query for table data.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

## Hydrological

### getHuc4WatershedData
Retrieve feature data from the HUC-4 service using an input point geometry.

Parameters:

**geometry**: The input point geometry.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

### getFlowlineData
Retrieve data for major rivers in a given HUC-4 watershed boundary identified by its HUC-4 ID.

Parameters:

**huc4ID**: The HUC-4 ID for the watershed to find rivers in.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

### getRelatedFlowsData
Retrieve the history of flow readings for each of the rivers found in a given HUC-4 watershed.

Parameters:

**featureID**: the featureID field value of a river feature from the flowlines feature service.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---

### getLocalReservoirData
Retrieve an array of the reservoirs found along the major rivers of a HUC-4 watershed.

Parameters:

**huc4ID**: The HUC-4 ID for the given watershed to find reservoirs for rivers in.


Returns an array of objects containing the key value pairs:
- **return**: Promise - A resolution or rejection of the query
---