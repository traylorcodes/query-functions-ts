/*
    Modules to help retrieve data from feature services
*/
import config from './config.json';
import * as types from './types';


export type CountyAndStateRequest = types.CountyAndStateRequest;
export type GetFipsRequest = types.GetFipsRequest;
export type DroughtPopRequest = types.DroughtPopRequest;
export type DroughtHousingRequest = types.DroughtHousingRequest;
export type PopulationDataRequest = types.PopulationDataRequest;
export type HousingDataRequest = types.HousingDataRequest;
export type PointGeometryQueryParameters = types.PointGeometryQueryParameters;

/**
 * Creates the URL used to execute the query
 * @param { string } serviceUrl The URL of the service REST endpoint to query on
 * @param { Object } options An object that contains different parameters to include in the request
 * @returns a URL that can be used to perform a query
 */
const generateUrlParams = (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean): string => {
    let url: string = serviceUrl + (queryingRelatedFeatures ? '/queryRelatedRecords?' : '/query?');

    // replace where clause with 1=1 if it is null
    if (!options.where) {
        options.where = '1=1';
    }

    let outFieldsParam: string = '';
    if (options.outFields) {
        outFieldsParam = `&outFields=${options.outFields.join('%2C+')}`;
        delete options.outFields;
    }

    return serviceUrl + (queryingRelatedFeatures ? '/queryRelatedRecords?' : '/query?') + new URLSearchParams({
        ...options,
        f: 'json'
    }).toString() + outFieldsParam;

    // // replace outFields with ['*'] if it is null
    // if (!options.outFields) {
    //     options.outFields = ['*'];
    // }
    // if (options.outFields.length > 1) {
    //     // options.outFields = options.outFields.join(`%2C+`);
    // }

    // return serviceUrl + (queryingRelatedFeatures ? '/queryRelatedFeatures?' : '/query?') + new URLSearchParams({
    //     ...options,
    //     f: 'json'
    // }).toString();
}

/**
 * Executes the query and resolves or rejects the promise that the function was called in
 * @param { string } url The URL used to execute the query 
 * @param { (value: T | PromiseLike<T>) => void } resolve The resolve function to complete a successful request
 * @param { (reason?: any) => void } reject The reject function to complete a failed request
 * @returns void
 */
function executeQuery(url: string, returnAttributesOnly: boolean, resolve: (value: any) => void, reject: (reason?: any) => void, queryingRelatedFeatures?: boolean) {
    fetch(url)
        .then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    reject(data.error);
                    // reject(url)
                    return;
                }
                const temp: any = [];
                if (queryingRelatedFeatures) {
                    data.relatedRecordGroups[0].relatedRecords.forEach((feature: any) => {
                        temp.push(feature.attributes);
                    });
                }
                // console.log('data', data);
                else {
                    data.features.forEach((feature: types.Point | types.Polygon | types.Polyline) => {
                        if (returnAttributesOnly) {
                            temp.push(feature.attributes)
                        }
                        else temp.push(
                            {
                                attributes: feature.attributes,
                                spatialReferenceWkid: data.spatialReference.wkid ?? null,
                                geometry: feature.geometry ?? null
                            }
                        );
                    });
                }
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
 * new workflow:
 * use geometry of point click to get county or state feature
 * this will return:
 * - OBJECTID
 * - GEOID
 * - Name, STATE
 * - P0010001, P0020002, P0030003, H0010001, H0020002, H0030003
 * 
 * Then, use the retrieved object ID to query all related features for population data
 * 
 * will need to identify whether or not to use county or state service urls
 */

// // get related features will 
// export const getRelatedFeatures: (serviceUrl: string, objectId: number, relationshipId: number, options: any) => Promise<Array<any>> =
//     (serviceUrl: string, objectId: number, relationshipId: number, options: any) => {

//     }

export const getDroughtHistory: any = (getCountyOrStateData: 'county' | 'state', objectId: number) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: ['*'],
                    objectIds: [objectId],
                    relationshipId: getCountyOrStateData === 'county' ? config.countyTableRelationshipId : config.stateTableRelationshipId,
                    returnGeometry: false
                },
                true
            )
            , true, resolve, reject, true)
    });
}


export const getFeatureHousingDataFromGeoId: any = (getCountyOrStateData: 'county' | 'state', geoId: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    where: `${config.geoIdFieldName} = '${geoId}'`,
                    outFields: [config.housingFields],
                    returnGeometry: false,
                }
            ),
            true, resolve, reject)
    });
};

export const getFeaturePopulationDataFromGeoId: any = (getCountyOrStateData: 'county' | 'state', geoId: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    where: `${config.geoIdFieldName} = '${geoId}'`,
                    outFields: [config.populationFields],
                    returnGeometry: false,
                }
            ),
            true, resolve, reject)
    });
};


// provide a point geometry to it and whether to retrieve county or state data, and will pass back the configured outfields
export const getIdInformationFromGeometry: any = (getCountyOrStateData: 'county' | 'state', geometry: { x: number, y: number, spatialReference: number }) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: getCountyOrStateData === 'county' ? config.countyIdInformationOutFields : config.stateIdInformationOutFields,
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    returnGeometry: false,
                }
            ),
            true, resolve, reject)
    });
}

// object id, the county geo id, p1, p2, p3, h1, name, state
// take object id and query related features using so

// question: when do you generate the url parameters??














/**
 * Retrieves population data for a specific county or state based on a provided FIPS code or GEOID
 * @param geoId The geoId to return data for
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.PopulationDataRequest>
 */
export const getPopulationDataByGeoId: (geoId: string, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.PopulationDataRequest>> = (geoId: string, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.PopulationDataRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.populationFields],
                    where: `${config.geoIdFieldName} = '${geoId}'`,
                    returnGeometry: false
                }
            ),
            true, resolve, reject
        );
    });
}

/**
 * Retrieves population data for a specific county based on a provided Point geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.PopulationDataRequest>
 */
export const getPopulationDataByGeometry: (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.PopulationDataRequest>> = (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.PopulationDataRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.populationFields],
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    returnGeometry: false
                }
            ), true, resolve, reject);
    });
}

/**
 * Retrieves housing data for a specific county based on a provided FIPS code
 * @param countyFIPS The FIPS code for a specific county to return data for
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.PopulationDataRequest>
 */
export const getHousingDataByGeoId: (geoId: string, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.HousingDataRequest>> = (geoId: string, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.HousingDataRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.housingFields],
                    where: `${config.geoIdFieldName} = '${geoId}'`,
                    returnGeometry: false
                }
            ),
            true, resolve, reject
        );
    });
}

/**
 * Retrieves housing data for a specific county based on a provided Point geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.PopulationDataRequest>
 */
export const getHousingDataByGeometry: (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.HousingDataRequest>> = (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.HousingDataRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.housingFields],
                    spatialReferenceWkid: geometry.spatialReference,
                    geometry: `${geometry.x}, ${geometry.y}`,
                    geometryType: "esriGeometryPoint",
                    returnGeometry: false
                }
            ), true, resolve, reject);
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
                config.countyPopulationServiceUrl,
                {
                    where: `${config.geoIdFieldName} = ${countyFIPS}`,
                    outFields: config.waterAndAreaFields,
                    token: token ? token : ''
                }
            );
        }
        else if (!countyFIPS && geometry) {
            url = generateUrlParams(
                config.countyPopulationServiceUrl,
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
        executeQuery(url, true, resolve, reject);
    });
}

/**
 * Retrieves a county FIPS code for a given point's geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's FIPS code
 */
export const getGeoIdByGeometry: (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.GetFipsRequest>>
    = (geometry: types.PointGeometryQueryParameters, getCountyOrStateData: 'county' | 'state') => {
        return new Promise<Array<types.GetFipsRequest>>((resolve, reject) => {
            executeQuery(
                generateUrlParams(
                    getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                    {
                        outFields: [config.geoIdFieldName],
                        spatialReferenceWkid: geometry.spatialReference,
                        geometry: `${geometry.x}, ${geometry.y}`,
                        geometryType: "esriGeometryPoint",
                        returnGeometry: false
                    }
                ), true, resolve, reject);
        });
    }

/**
 * Retrieves drought level population data for a feature based on a given county FIPS code
 * @param geoId the Geo ID code of the area
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's population drought level data
 */
export const getPopulationDroughtLevelsByGeoId: (geoId: string, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.DroughtPopRequest>> = (fipsCode: string, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.DroughtPopRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.populationDroughtFields],
                    where: `${config.geoIdFieldName} = '${fipsCode}'`,
                    returnGeometry: false
                }
            ),
            true, resolve, reject
        );
    });
}

/**
 * Retrieves drought level housing data for a feature based on a given county FIPS code
 * @param geoId the Geo ID code of the area
 * @param getCountyOrStateData indicate whether to return data from the county service or the state service
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's housing drought level data
 */
export const getHousingDroughtLevelsByGeoId: (geoId: string, getCountyOrStateData: 'county' | 'state') => Promise<Array<types.DroughtHousingRequest>> = (fipsCode: string, getCountyOrStateData: 'county' | 'state') => {
    return new Promise<Array<types.DroughtHousingRequest>>((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: [config.housingDroughtFields],
                    where: `${config.geoIdFieldName} = '${fipsCode}'`,
                    returnGeometry: false
                }
            ),
            true, resolve, reject
        );
    });
}

/**
 * Retrieves a county and state name based on a given geometry
 * @param geometry The geometry used to query for a feature to return data for
 * @returns Promise<Array<types.Point | types.Feature | types.Polygon>> containing a returned feature's county and state name
 */
export const getCountyAndStateName: (geometry: PointGeometryQueryParameters)
    => Promise<Array<types.CountyAndStateRequest>> = (geometry: PointGeometryQueryParameters) => {
        return new Promise<Array<types.CountyAndStateRequest>>((resolve, reject) => {
            executeQuery(
                generateUrlParams(
                    config.countyPopulationServiceUrl,
                    {
                        outFields: config.stateAndCountyFieldNames,
                        spatialReferenceWkid: geometry.spatialReference,
                        geometry: `${geometry.x}, ${geometry.y}`,
                        geometryType: "esriGeometryPoint",
                        returnGeometry: false
                    }
                ), true, resolve, reject)
        });
    }