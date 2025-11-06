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

const generateUrlParams = (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean): string => {
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


function executeQuery(url: string, returnAttributesOnly: boolean, resolve: (value: any) => void, reject: (reason?: any) => void, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean) {
    fetch(url)
        .then((response) => {
            response.json().then((data) => {
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

// retrieve the last data edit date for the wind gust layer
export const getWindGustLayerEditingInfo: () => Promise<number> = async () => {
    try {
        const response = await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_WindGust_v1/FeatureServer/0?f=json&cacheHint=true');
        if (response) {
            const json = await response.json();
            if (json && json.editingInfo && json.editingInfo.dataLastEditDate && !isNaN(json.editingInfo.dataLastEditDate)) {
                return parseInt(json.editingInfo.dataLastEditDate);
            }
            throw (new Error('The Wind Gust Layer JSON request was successful but the data last edit date could not be retrieved'));
        }
        throw (new Error('The Wind Gust Layer JSON request could not be successfully read'));
    } catch (e) {
        throw (e);
    }
}

// retrieve the last data edit date for the wind speed layer
export const getWindSpeedLayerEditingInfo: () => Promise<number> = async () => {
    try {
        const response = await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_WindSpeed_v1/FeatureServer/0?f=json&cacheHint=true');
        if (response) {
            const json = await response.json();
            if (json && json.editingInfo && json.editingInfo.dataLastEditDate && !isNaN(json.editingInfo.dataLastEditDate)) {
                return parseInt(json.editingInfo.dataLastEditDate);
            }
            throw (new Error('The Wind Speed Layer JSON request was successful but the data last edit date could not be retrieved'));
        }
        throw (new Error('The Wind Speed Layer JSON request could not be successfully read'));
    } catch (e) {
        throw (e);
    }
}

// retrieve the last data edit date for the accumulated precipitation layer
export const getAccumulatedPrecipitationLayerEditingInfo: () => Promise<number> = async () => {
    try {
        const response = await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_Precipitation_v1/FeatureServer/1?f=json&cacheHint=true');
        if (response) {
            const json = await response.json();
            if (json && json.editingInfo && json.editingInfo.dataLastEditDate && !isNaN(json.editingInfo.dataLastEditDate)) {
                return parseInt(json.editingInfo.dataLastEditDate);
            }
            throw (new Error('The Accumulated Precipitation JSON request was successful but the data last edit date could not be retrieved'));
        }
        throw (new Error('The Accumulated Precipitation Layer JSON request could not be successfully read'));
    } catch (e) {
        throw (e);
    }
}

// retrieve the last data edit date for the amount by time precipitaion layer layer
export const getAmountByTimePrecipitationLayerEditingInfo: () => Promise<number> = async () => {
    try {
        const response = await fetch('https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_Precipitation_v1/FeatureServer/0?f=json&cacheHint=true');
        if (response) {
            const json = await response.json();
            if (json && json.editingInfo && json.editingInfo.dataLastEditDate && !isNaN(json.editingInfo.dataLastEditDate)) {
                return parseInt(json.editingInfo.dataLastEditDate);
            }
            throw (new Error('The Amount By Time Precipitation Layer JSON request was successful but the data last edit date could not be retrieved'));
        }
        throw (new Error('The Amount By Time Precipitation Layer JSON request could not be successfully read'));
    } catch (e) {
        throw (e);
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

export type HurricaneAwareCountyTableReturnFeature = {
    attributes: {
        fips: number | null,
        state: string | null,
        county: string | null,
        totalPop: number | null,
        totalHouseholds: number | null,
        popUnder18: number | null,
        percentPopUnder18: number | null,
        popOver64: number | null,
        percentPopOver64: number | null,
        popDisabled: number | null,
        percentPopDisabled: number | null,
        popInNursing: number | null,
        mobileHomeHouseholds: number | null,
        percentMobileHomeHouseholds: number | null,
        noVehicleHouseholds: number | null,
        percentNoVehicleHouseholds: number | null,
        householdsWithPets: number | null,
        percentPetHouseholds: number | null,
        popOver18LimitedEnglish: number | null,
        percentPopOver18LimitedEnglish: number | null,
        noSmartphoneHouseholds: number | null,
        percentNoSmartphoneHouseholds: number | null,
        noInternetHouseholds: number | null,
        percentNoInternetHouseholds: number | null,
        communityResilience: string | null,
        currentRiskRating: string | null,
        futureRiskRating: string | null,
    }
    geometry: { rings: Array<Array<number>> },
    spatialReferenceWkid: number
}

// export const retrieveHurricaneServiceCountyData: ( geometry: PointGeometryQueryParameters) => Promise<Array<HurricaneAwareCountyServiceReturnFeature>> = (geometry: PointGeometryQueryParameters) => {
export const retrieveHurricaneTableCountyData: (fips: number) => Promise<Array<HurricaneAwareCountyTableReturnFeature>> = (fips: number) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                // 'https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/hurricane_aware_test_v3/FeatureServer/0',
                'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/0',
                {
                    outFields: [
                        'acs_fips as fips',
                        'acs_state as state',
                        'acs_county as county',
                        'acs_totalpop as totalPop',
                        'acs_totalhouseholds as totalHouseholds',
                        'acs_popless18 as popUnder18',
                        'acs_prctpopless18 as percentPopUnder18',
                        'acs_pop65over as popOver64',
                        'acs_prctpop65over as percentPopOver64',
                        'acs_popdisability as popDisabled',
                        'acs_prctpopdisability as percentPopDisabled',
                        'hacust_popinnursing as popInNursing',
                        'acs_mobilehomes as mobileHomeHouseholds',
                        'acs_prctmobilehomes as percentMobileHomeHouseholds',
                        'acs_housenoveh as noVehicleHouseholds',
                        'acs_prcthousenoveh as percentNoVehicleHouseholds',
                        'hacust_poppets as householdsWithPets',
                        'hacust_prctpoppets as percentPetHouseholds',
                        'acs_pop18overltdeng as popOver18LimitedEnglish',
                        'acs_prctpop18overltdeng as percentPopOver18LimitedEnglish',
                        'acs_housenosmrtphn as noSmartphoneHouseholds',
                        'acs_prcthousenosmrtphn as percentNoSmartphoneHouseholds',
                        'acs_housenointernet as noInternetHouseholds',
                        'acs_prcthousenointernet as percentNoInternetHouseholds',
                        'nri_commresilrating as communityResilience',
                        'nri_hurrhzrdtypriskindrtg as currentRiskRating',
                        'hacust_futurehzrdtyprisk as futureRiskRating'
                    ],
                    where: `acs_fips = ${fips}`,
                    // geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                    // inSR: geometry.spatialReference,
                    outSR: 4326,
                    // geometryType: 'esriGeometryPoint',
                    returnGeometry: true,
                    geometryPrecision: 4,
                    resultType: 'tile',
                    cacheHint: true
                }
            )
            , false, resolve, reject)
    });
}

export type HurricaneAwareCountyWatchAndWarningFeature = {
    fips: number | null,
    type: string | null
}

export const retrieveHurricaneAwareCountyWatchesAndWarnings: (fips: number) => Promise<Array<HurricaneAwareCountyWatchAndWarningFeature>> = (fips: number) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/5',
            {
                outFields: [
                    'acs_fips as fips',
                    'www_event as type'
                ],
                where: `acs_fips = ${fips}`,
                returnDistinctValues: true,
                // where: `1=1`,
                cacheHint: true
            }
        )
        executeQuery(url, true, resolve, reject);
    })
}

export type HurricaneAwareWindGustFeature = {
    OBJECTID: number,
    force: number,
    fromdate: number,
    todate: number,
    label: string
}

export const retrieveHurricaneAwareWindGustData: (geometry: types.PointGeometryQueryParameters) => Promise<Array<HurricaneAwareWindGustFeature>> = (geometry: types.PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_WindGust_v1/FeatureServer/0',
            {
                outFields: [
                    'OBJECTID as OBJECTID',
                    'force as force',
                    'fromdate as fromdate',
                    'todate as todate',
                    'label as label'
                ],
                geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                inSR: geometry.spatialReference,
                outSR: 4326,
                geometryType: 'esriGeometryPoint',
                returnGeometry: false,
                geometryPrecision: 4,
                resultType: 'tile',
                orderByFields: 'fromdate ASC',
                cacheHint: true
            }
        );
        executeQuery(url, true, resolve, reject);
    });
}

export const retrieveHurricaneAwareWindSpeedData: (geometry: types.PointGeometryQueryParameters) => Promise<Array<HurricaneAwareWindGustFeature>> = (geometry: types.PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_WindSpeed_v1/FeatureServer/0',
            {
                outFields: [
                    'OBJECTID as OBJECTID',
                    'force as force',
                    'fromdate as fromdate',
                    'todate as todate',
                    'label as label'
                ],
                geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                inSR: geometry.spatialReference,
                outSR: 4326,
                geometryType: 'esriGeometryPoint',
                returnGeometry: false,
                geometryPrecision: 4,
                resultType: 'tile',
                orderByFields: 'fromdate ASC',
                cacheHint: true
            }
        );
        executeQuery(url, true, resolve, reject);
    });
}

export type HurricaneAwarePrecipFeature = {
    OBJECTID: number,
    category: number,
    fromdate: number,
    todate: number,
    label: string
}

export const retrieveHurricaneAwarePrecipAmountFeatures: (geometry: types.PointGeometryQueryParameters) => Promise<Array<HurricaneAwarePrecipFeature>> = (geometry: types.PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_Precipitation_v1/FeatureServer/0',
            {
                outFields: [
                    'OBJECTID as OBJECTID',
                    'category as category',
                    'fromdate as fromdate',
                    'todate as todate',
                    'label as label'
                ],
                geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                inSR: geometry.spatialReference,
                outSR: 4326,
                geometryType: 'esriGeometryPoint',
                returnGeometry: false,
                geometryPrecision: 4,
                resultType: 'tile',
                orderByFields: 'fromdate ASC',
                cacheHint: true
            }
        );
        executeQuery(url, true, resolve, reject);
    });
}

export const retrieveHurricaneAwarePrecipAccumulationFeatures: (geometry: types.PointGeometryQueryParameters) => Promise<Array<HurricaneAwarePrecipFeature>> = (geometry: types.PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/NDFD_Precipitation_v1/FeatureServer/1',
            {
                outFields: [
                    'OBJECTID as OBJECTID',
                    'category as category',
                    'fromdate as fromdate',
                    'todate as todate',
                    'label as label'
                ],
                geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                inSR: geometry.spatialReference,
                outSR: 4326,
                geometryType: 'esriGeometryPoint',
                returnGeometry: false,
                geometryPrecision: 4,
                resultType: 'tile',
                orderByFields: 'fromdate ASC',
                cacheHint: true
            }
        );
        executeQuery(url, true, resolve, reject);
    });
}

export const retrieveCountyFIPSCodeFromHurricaneService: (geometry: PointGeometryQueryParameters) => Promise<Array<{ fips: number }>> = (geometry: PointGeometryQueryParameters) => {
    return new Promise((resolve, reject) => {
        executeQuery(
            generateUrlParams(
                'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/0',
                {
                    outFields: ['acs_fips as fips'],
                    geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
                    inSR: geometry.spatialReference,
                    // outSR: 4326,
                    geometryType: 'esriGeometryPoint',
                    // returnGeometry: true,
                    // geometryPrecision: 4,
                    // resultType: 'tile',
                    cacheHint: true,
                }
            ),
            true,
            resolve,
            reject);
    });
}

export type HurricaneAwareActiveStormsTableFeature = {
    OBJECTID: number,
    stormName: string,
    popUnderAdvisory: number,
    basin: string
};

export const getHurricaneAwareActiveStormsTableFeatures: () => Promise<Array<HurricaneAwareActiveStormsTableFeature>> = () => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/3',
            {
                outfields: [
                    'OBJECTID as OBJECTID',
                    'stormname as stormName',
                    'totalpop as popUnderAdvisory',
                    'basin as basin'
                ]
            });
        executeQuery(url, true, resolve, reject);
    });
}

export type HurricaneAwareStormForecastFeature = {
    OBJECTID: number,
    stormName: string,
    basin: string,
    advisoryDate: number,
    dateLabel: string,
    fullDate: string,
    maxWind: number,
    gust: number,
    TCDVLP: string,
    STORMSRC: string
}

export const getHurricaneAwareStormForecastFeatures: (stormName: string) => Promise<Array<HurricaneAwareStormForecastFeature>> = (stormName: string) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/2', {
            where: `STORMNAME = '${stormName}'`,
            orderBy: 'FLDATELABEL asc',
            outFields: [
                'OBJECTID as OBJECTID',
                'STORMNAME as stormName',
                'BASIN as basin',
                'ADVDATE as advisoryDate',
                'MAXWIND as maxWind',
                'GUST as gust',
                'TCDVLP as TCDVLP',
                'STORMSRC as STORMSRC',
                'DATELBL as dateLabel',
                'FLDATELBL as fullDate'
            ]
        });

        executeQuery(url, true, resolve, reject);
    });
}

export type HurricaneAwareStormObservedPositionFeature = {
    OBJECTID: number,
    stormName: string,
    totalpop: number,
    basin: string,
    date: number,
    intensity: number
}

export const getHurricaneAwareStormObservedPositionFeatures: () => Promise<Array<HurricaneAwareStormObservedPositionFeature>> = () => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/1',
            {
                // where: `STORMNAME = '${stormName}'`,
                where: `1=1`,
                outFields: [
                    'OBJECTID as OBJECTID',
                    'STORMNAME as stormName',
                    'BASIN as basin',
                    'STORMTYPE as stormType',
                    'DTG as date',
                    'INTENSITY as intensity'
                ]
            });

        executeQuery(url, true, resolve, reject);
    });
}

export type HurricaneAwareKeyMessageFeature = {
    OBJECTID: number,
    stormName: string,
    message: string
}

export const getHurricaneAwareKeyMessageFeatures: (stormName: string) => Promise<Array<HurricaneAwareKeyMessageFeature>> = (stormName: string) => {
    return new Promise((resolve, reject) => {
        const url = generateUrlParams(
            'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/hurricane_aware_aggregated_data/FeatureServer/1',
            {
                where: `STORMNAME = '${stormName}'`,
                outFields: [
                    'OBJECTID as OBJECTID',
                    'stormname as stormName',
                    'key_messages as message'
                ]
            });

        executeQuery(url, true, resolve, reject);
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
                    // outFields: ['*'],
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