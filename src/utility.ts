// import * as types from './types';

// export type Point = types.Point;
// export type Polygon = types.Polygon;
// export type Polyline = types.Polyline;
// export type PointGeometryQueryParameters = types.PointGeometryQueryParameters;


export type Point = {
    spatialReference: { wkid: number },
    geometry: {
        x: number,
        y: number
    }
    attributes: {
        [key: string]: number | string
    }
}

export type Polygon = {
    spatialReference: { wkid: number },
    geometry: {
        rings: Array<number>[][]
    },
    attributes: {
        [key: string]: number | string
    }
}

export type Polyline = {
    spatialReference: { wkid: number },
    geometry: {
        paths: Array<number>[][][]
    },
    attributes: {
        [key: string]: number | string
    }
}

export type PointGeometryQueryParameters = {
    spatialReference: number,
    x: number,
    y: number,
}


export const generateUrlParams: (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean) => string =
    (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean) => {
        // replace where clause with 1=1 if it is null
        if (!options.where && !reverseGeocoding && !queryingItemJSON) {
            options.where = '1=1';
        }

        let outFieldsParam: string = '';
        if (options.outFields) {
            outFieldsParam = `&outFields=${options.outFields.join('%2C+')}`;
            delete options.outFields;
        }

        return serviceUrl + (queryingRelatedFeatures ? '/queryRelatedRecords?' : reverseGeocoding ? '/reverseGeocode?' : queryingItemJSON ? '' : '/query?') + new URLSearchParams({
            ...options,
            f: 'json'
        }).toString() + outFieldsParam;
    }

export const executeQuery = (url: string, returnAttributesOnly: boolean, resolve: (value: any) => void, reject: (reason?: any) => void, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean) => {
    try {
        fetch(url)
            .then((response) => {
                response.json().then(
                    (data) => {
                        if (data.error) {
                            reject(data.error);
                            // reject(url)
                            return;
                        }
                        if (reverseGeocoding || queryingItemJSON) {
                            resolve(data);
                            return;
                        }
                        const temp: Array<any> = [];
                        if (queryingRelatedFeatures) {
                            data.relatedRecordGroups[0]?.relatedRecords?.forEach((feature: any) => {
                                temp.push(feature.attributes);
                            });
                        }
                        else {
                            data.features.forEach((feature: Point | Polygon | Polyline) => {
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
                    },
                    (rejectedReason) => {
                        reject(rejectedReason);
                    })
                    .catch((e) => {
                        reject(e);
                        // reject(url);
                    })
            },
                (rejectedReason) => {
                    reject(rejectedReason);
                }
            )

    } catch (e) {
        reject(e);
    }
}

export const reverseGeocodePoint: (geometry: PointGeometryQueryParameters) => Promise<any> = (geometry: PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
                {
                    location: `${geometry.x},${geometry.y}`,
                    cacheHint: true,
                }, false, true
            )
            , true, resolve, reject, false, false, true);
    })
}

// export default null;