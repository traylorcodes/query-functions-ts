/*
    Modules to help retrieve data from feature services
*/
import config from './config.json';
import * as types from './types';

/**
 * Creates the URL used to execute the query
 * @param { string } serviceUrl The URL of the service REST endpoint to query on
 * @param { Object } options An object that contains different parameters to include in the request
 * @returns a URL that can be used to perform a query
 */
const generateUrlParams = (serviceUrl: string, options: any): string => {
    // replace where clause with 1=1 if it is null
    if (!options.where) {
        options.where = '1=1';
    }
    // replace outFields with ['*'] if it is null
    if (!options.outFields) {
        options.outFields = ['*'];
    }

    return serviceUrl + '/query/?' + new URLSearchParams({
        ...options,
        f: 'json'
    }).toString();
}

/**
 * Executes the query and resolves or rejects the promise that the function was called in
 * @param { string } url The URL used to execute the query 
 * @param { (value: T | PromiseLike<T>) => void } resolve The resolve function to complete a successful request
 * @param { (reason?: any) => void } reject The reject function to complete a failed request
 * @returns void
 */
function executeQuery(url: string, resolve: (value: any) => void, reject: (reason?: any) => void) {
    fetch(url)
        .then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    reject(data.error);
                    // reject(url)
                    return;
                }
                // console.log('data', data);
                const temp: any = [];
                data.features.forEach((feature: types.Point | types.Polygon | types.Polyline) => {
                    temp.push(
                        {
                            attributes: feature.attributes,
                            spatialReferenceWkid: data.spatialReference.wkid ?? null,
                            geometry: feature.geometry ?? null
                        }
                    );
                });
                resolve(temp);
                // resolve(data);
            })
                .catch((e) => {
                    reject(e);
                    // reject(url);
                })
        })
        .catch((e) => {
            reject(e)
            // reject(url)
        });
}

/**
 * Retrieves population data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for.
 * @param countyFIPS The FIPS code for a specific county to return data for
 * @param geometry The geometry used to query for a feature to return data for
 * @param token A token that can optionally be provide for cases where the service is protected
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>>
 */
export const getPopulationData = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number }, token?: string): Promise<Array<types.Point | types.Polygon | types.Polyline>> => {
    return new Promise((resolve, reject) => {
        let url: string;
        if (countyFIPS && !geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    where: `GEOID = '${countyFIPS}'`,
                    outFields: config.populationFields,
                    token: token ? token : ''
                }
            );
        }
        else if (!countyFIPS && geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: config.populationFields,
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    token: token ? token : ''
                }
            );
        }
        else {
            reject('No FIPS code or geometry was provided.');
            return;
        }
        executeQuery(url, resolve, reject);
    });
}

/**
 * Retrieves housing data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for.
 * @param countyFIPS The FIPS code for a specific county to return data for
 * @param geometry The geometry used to query for a feature to return data for
 * @param token A token that can optionally be provide for cases where the service is protected
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>>
 */
export const getHousingData = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number }, token?: string): Promise<types.Point | types.Polygon | types.Polyline> => {
    return new Promise((resolve, reject) => {
        let url: string;
        if (countyFIPS && !geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    where: `${config.fipsCodeFieldName} = ${countyFIPS}`,
                    outFields: config.housingFields,
                    token: token ? token : ''
                }
            );
        }
        else if (!countyFIPS && geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: config.housingFields,
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    token: token ? token : ''
                }
            );
        }
        else {
            reject('No FIPS code or geometry was provided.');
            return;
        }
        executeQuery(url, resolve, reject);
    });
}

/**
 * Retrieves water and land area data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for.
 * @param countyFIPS The FIPS code for a specific county to return data for
 * @param geometry The geometry used to query for a feature to return data for
 * @param token A token that can optionally be provide for cases where the service is protected
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>>
 */
export const getWaterAndLandArea = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number }, token?: string): Promise<Array<types.Point | types.Polygon | types.Polyline>> => {
    return new Promise((resolve, reject) => {
        let url: string;
        if (countyFIPS && !geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    where: `${config.fipsCodeFieldName} = ${countyFIPS}`,
                    outFields: config.waterAndAreaFields,
                    token: token ? token : ''
                }
            );
        }
        else if (!countyFIPS && geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: config.waterAndAreaFields,
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    token: token ? token : ''
                }
            );
        }
        else {
            reject('No FIPS code or geometry was provided.');
            return;
        }
        executeQuery(url, resolve, reject);
    });
}

/**
 * Retrieves a county FIPS code for a given point's geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's FIPS code
 */
export const getCountyFipsCodeByGeometry = (geometry: { spatialReference: number, x: number, y: number }) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: [config.fipsCodeFieldName],
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    returnGeometry: false
                }
            ), resolve, reject);
    });
}

/**
 * Retrieves drought level data for a feature based on a given county FIPS code
 * @param fipsCode the FIPS code of the county
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's drought level data
 */
export const getDroughtLevelsByCountyFips = (fipsCode: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: [config.populationDroughtFields],
                    where: `${config.fipsCodeFieldName} = '${fipsCode}'`,
                    returnGeometry: false
                }
            ),
            resolve, reject
        );
    });
}

/**
 * Retrieves a county and state name based on a given geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's county and state name
 */
export const getCountyAndStateName = (geometry: {x: number, y: number, spatialReference: number}) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.populationServiceUrl,
                {
                    outFields: config.stateAndCountyFieldNames,
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    returnGeometry: false
                }
            ), resolve, reject);
    });
}