# query-functions-ts

## Use
To use this library, install it in your application using the command
 ```npm i query-functions-ts```

 This module contains the querying functions used to retrieve data in the 2024 Esri Living Atlas Drought Aware application.

 The functions retrieve data from a variety of feature services that may be reusable in multiple applications. Below is a list of functions and the data that is retrieved.

# Available Functions

## Utility

### generateUrlParams

Generates a URL parameter string to use for querying a service

Parameters:

**serviceUrl**: The url of the service being queried.

**options**: A data object of key and value pairs to append as parameters on the url.

**queryingRelatedFeatures**: Optional. Indicate if the url directory should include "/queryRelatedFeatures" for a related query.

Returns an array of objects containing the key value pairs:

- **return**: string - a string of the complete URL with the appended parameters to execute a query on.
---

### executeQuery
Resolves or rejects a Promise by attempting to query with the URL created by the generateUrlParams function.

Parameters:
**url**: The URL to query.
**returnAttributesOnly**: Indicates whether or not to include the geometry of returned features.
**resolve**: The Promise's resolve function.
**reject**: The Promise's reject function.
**queryingRelatedRecords**: Optional. Indicate whether or not this is a query for related records.

Returns an array of objects containing the key value pairs:
- **return**: void
---

Further documentation of the following categories will be released in the near future:

## Drought

## ACS

## Population

## Agriculture

## Hydrological