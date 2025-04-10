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


const generateUrlParams = (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean): string => {
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
}

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
                    data.relatedRecordGroups[0]?.relatedRecords?.forEach((feature: any) => {
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

export const retrieveListOfNationalDroughtLevelPeriods: any = () => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.nationalDroughtServiceUrl,
                {
                    outFields: [config.nationalAndWaterDroughtLevelTimeFields],
                    returnGeometry: false,
                    cacheHint: true,
                },
                false
            )
            , true, resolve, reject, false)
    });
}

export const retrieveDroughtLevelData: any = (
    featureCategory: 'county' | 'state' | 'nation' | 'water',
    id?: string
) => {
    let serviceUrl: string = '';
    let where = '1=1';
    switch (featureCategory) {
        case ('county'):
            serviceUrl = config.countyDroughtServiceUrl
            where = `${config.droughtServiceFipsFieldName} = '${id}'`
            where
            break;
        case ('state'):
            serviceUrl = config.stateDroughtServiceUrl
            where = `${config.droughtServiceFipsFieldName} = '${id}'`
            break;
        case ('nation'):
            serviceUrl = config.nationalDroughtServiceUrl
            break;
        case ('water'):
            serviceUrl = config.waterDroughtServiceUrl;
            where = `huc4 = '${id}'`
            break;
    }

    return new Promise((resolve, reject) => {

        executeQuery(
            generateUrlParams(
                serviceUrl,

                {
                    outFields: [
                        ['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtLevelOutFields : config.nationalDroughtLevelOutFields,
                        ['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtLevelTimeFields : config.nationalAndWaterDroughtLevelTimeFields,
                        // ['county', 'state'].find((c: string) => c === featureCategory) !== undefined ? config.droughtServiceFipsFieldName : ''
                    ],
                    where: where,
                    returnGeometry: false,
                    orderByFields: `${['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtDateFieldName : config.nationalAndWaterDroughtFieldName} DESC`,
                    cacheHint: true,
                }
            )
            , true, resolve, reject)
    });
}

export const getPopulationServiceData:
    (
        getCountyOrStateData: 'county' | 'state',
        geometry: PointGeometryQueryParameters,
        returnIdInformationData: boolean,
        returnPopulationData: boolean,
        returnHousingData: boolean,
        returnAgricultureData: boolean,
        returnEconomicImpactData: boolean,
        getAgriValue: boolean,
    ) => Promise<any> =
    (
        getCountyOrStateData: 'county' | 'state',
        geometry: PointGeometryQueryParameters,
        returnIdInformationData: boolean,
        returnPopulationData: boolean,
        returnHousingData: boolean,
        returnAgricultureData: boolean,
        returnEconomicImpactData: boolean,
        getAgriValue: boolean,

    ) => {
        // make call 
        // what return?? put in out fields
        return new Promise((resolve, reject) => {
            executeQuery(
                generateUrlParams(
                    getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                    {
                        outFields: [
                            returnIdInformationData ? (getCountyOrStateData === 'county' ? config.countyIdInformationOutFields : config.stateIdInformationOutFields) : '',
                            returnPopulationData ? config.populationFields : '',
                            returnHousingData ? config.housingFields : '',
                            returnAgricultureData ? config.agricultureLayerFields : '',
                            getCountyOrStateData === 'county' ? config.socialAndCommunityPopulationFields : '',
                            returnEconomicImpactData && getCountyOrStateData === 'county' ? config.countyEconomicImpactPopulationFields : '',
                            returnEconomicImpactData && getCountyOrStateData === 'state' ? config.stateEconomicImpactPopulationFields : '',
                            getAgriValue ? 'AGRIVALUE' : ''
                        ],
                        geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                        inSR: geometry.spatialReference,
                        outSR: 4326,
                        geometryType: 'esriGeometryPoint',
                        returnGeometry: true,
                        geometryPrecision: 4,
                        resultType: 'tile',
                        cacheHint: true,
                    }
                )
                , false, resolve, reject)
        });
    }

export const getPopulationHistory: any = (getCountyOrStateData: 'county' | 'state', objectId: number) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: ['*'],
                    objectIds: [objectId],
                    relationshipId: getCountyOrStateData === 'county' ? config.countyTableRelationshipId : config.stateTableRelationshipId,
                    returnGeometry: false,
                    cacheHint: true,
                },
                true
            )
            , true, resolve, reject, true)
    });
}

export const getAgricultureHistory: any = (getCountyOrStateData: 'county' | 'state', objectId: number) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
                {
                    outFields: ['*'],
                    objectIds: [objectId],
                    relationshipId: getCountyOrStateData === 'county' ? config.countyAgricultureRelationshipId : config.stateAgricultureRelationshipId,
                    returnGeometry: false,
                    cacheHint: true,
                },
                true
            )
            , true, resolve, reject, true)
    });
}

export const getHuc4WatershedData: (
    geometry: PointGeometryQueryParameters
) => any = (geometry: PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.watershedHuc4LayerServiceUrl,
                {
                    geometry: `{"x": ${geometry.x.toPrecision(6)},"y": ${geometry.y.toPrecision(6)},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                    inSR: geometry.spatialReference,
                    outFields: ['objectid', 'huc4 as HUC4', 'name as NAME'],
                    outSR: 4326,
                    geometryType: 'esriGeometryPoint',
                    returnGeometry: true,
                    geometryPrecision: 4,
                    resultType: 'tile',
                    cacheHint: true,
                }
            ), false, resolve, reject
        );
    });
}

export const getFlowlineData: (huc4ID: string) => any = (huc4ID: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.flowlinesLayerServiceUrl,
                {
                    // huc4: huc4ID,
                    where: `huc4 = '${huc4ID}'`,
                    outFields: ['*'],
                    returnGeometry: false,
                    cacheHint: true,
                }
            ), true, resolve, reject
        )
    });
}

export const getRelatedFlowsData: (featureID: string) => any = (featureID: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.nwmFlowsTableUrl,
                {
                    where: `feature_id = '${featureID}'`,
                    outFields: ['*'],
                    cacheHint: true,
                }
            ), true, resolve, reject
        )
    });
}

export const getLocalReservoirData: (huc4ID: string) => any = (huc4ID: string) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                config.nidSubsetTableUrl,
                {
                    where: `huc4 = '${huc4ID}'`,
                    outFields: ['*'],
                    cacheHint: true,
                }
            ), true, resolve, reject
        )
    });
}