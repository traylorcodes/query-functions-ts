/*
    Modules to help retrieve data from feature services
*/
import config from './config.json';

type WaterAndAreaData = {
    ALAND: number,
    AWATER: number
}

type FipsGeometryQueryOptions = {
    countyFIPS?: string,
    geometry?: {
        spatialReference: number,
        x: number,
        y: number
    },
    token?: string
};

type Point = {
    spatialReference: { wkid: number },
    geometry: {
        x: number,
        y: number
    }
    attributes: {
        [key: string]: number | string
    }
}

type Polygon = {
    spatialReference: { wkid: number },
    geometry: {
        rings: Array<number>[][]
    },
    attributes: {
        [key: string]: number | string
    }
}

type Polyline = {
    spatialReference: { wkid: number },
    geometry: {
        paths: Array<number>[][][]
    },
    attributes: {
        [key: string]: number | string
    }
}

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
                    return;
                }
                console.log('data', data);
                const temp: any = [];
                // const temp: Array<PopulationData | HousingData | WaterAndAreaData> = [];
                data.features.forEach((feature: Point | Polygon | Polyline) => {
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
                })
        })
        .catch((e) => {
            reject(e)
        });
}

/**
 * Retrieves population data for a specific county. Can be used to find a specific county by FIPS code or a point geometry to find a feature to return data for.
 * @param countyFIPS The FIPS code for a specific county to return data for
 * @param geometry The geometry used to query for a feature to return data for
 * @returns Promise<PopulationData[]>
 */
// export const getPopulationData = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number, geometryType: "esriGeometryEnvelope" | "esriGeometryPoint" | "esriGeometryPolyline" | "esriGeometryPolygon" | "esriGeometryMultipoint"}, token?: string): Promise<PopulationData[]> => {
export const getPopulationData = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number }, token?: string): Promise<Array<Point | Polygon | Polyline>> => {
    return new Promise((resolve, reject) => {
        let url: string;
        if (countyFIPS && !geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    // where: `${config.fipsCodeFieldName} = ${countyFIPS}`,
                    where: `GEOID = '${countyFIPS}'`,
                    outFields: config.populationFields,
                    token: token ? token : null
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
                    // geometryType: geometry.geometryType
                    token: token ? token : null
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
 * @returns Promise<HousingData[]>
 */
export const getHousingData = (countyFIPS?: string, geometry?: { spatialReference: number, x: number, y: number }, token?: string): Promise<Point | Polygon | Polyline> => {
    return new Promise((resolve, reject) => {
        let url: string;
        if (countyFIPS && !geometry) {
            url = generateUrlParams(
                config.populationServiceUrl,
                {
                    where: `${config.fipsCodeFieldName} = ${countyFIPS}`,
                    // where: `GEOID = '${countyFIPS}'`,
                    outFields: config.housingFields,
                    token: token ? token : null
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
                    // geometryType: geometry.geometryType
                    token: token ? token : null
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


export const getWaterAndLandArea = (options: FipsGeometryQueryOptions): Promise<WaterAndAreaData[]> => {
    return new Promise((resolve, reject) => {
        let url: string = checkForFipsOrGeometry(options, config.waterAndAreaFields);
        if (url === '') {
            reject('No FIPS code or geometry was provided.');
        }
        executeQuery(url, resolve, reject);
    });
}


const checkForFipsOrGeometry = (options: FipsGeometryQueryOptions, outFields: Array<string>): string => {
    if (options.countyFIPS && !options.geometry) {
        return generateUrlParams(
            config.populationServiceUrl,
            {
                where: `${config.fipsCodeFieldName} = ${options.countyFIPS}`,
                // where: `GEOID = '${options.countyFIPS}'`,
                outFields: outFields,
                token: options.token ? options.token : null
            }
        );
    } else if (!options.countyFIPS && options.geometry) {
        return generateUrlParams(
            config.populationServiceUrl,
            {
                outFields: outFields,
                spatialReferenceWkid: options.geometry.spatialReference,
                geometry: `${options.geometry.x}, ${options.geometry.y}`,
                geometryType: "esriGeometryPoint",
                // geometryType: geometry.geometryType
                token: options.token ? options.token : null
            }
        );
    }
    else return '';
}