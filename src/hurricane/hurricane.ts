import * as types from './types';
import { generateUrlParams, executeQuery, PointGeometryQueryParameters } from '../utility';
// import * as utilities from '../utility'

// declare namespace Hurricane {
export type HurricaneAwareCountyTableReturnFeature = types.HurricaneAwareCountyTableReturnFeature;
export type HurricaneAwareKeyMessageFeature = types.HurricaneAwareKeyMessageFeature;
export type HurricaneAwareWindGustFeature = types.HurricaneAwareWindGustFeature;
export type HurricaneAwarePrecipFeature = types.HurricaneAwarePrecipFeature;
export type HurricaneAwareActiveStormsTableFeature = types.HurricaneAwareActiveStormsTableFeature;
export type HurricaneAwareStormForecastFeature = types.HurricaneAwareStormForecastFeature;
export type HurricaneAwareStormObservedPositionFeature = types.HurricaneAwareStormObservedPositionFeature;

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

export const retrieveHurricaneAwareCountyWatchesAndWarnings: (fips: number) => Promise<Array<types.HurricaneAwareCountyWatchAndWarningFeature>> = (fips: number) => {
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

export const retrieveHurricaneAwareWindGustData: (geometry: PointGeometryQueryParameters) => Promise<Array<HurricaneAwareWindGustFeature>> = (geometry: PointGeometryQueryParameters) => {
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

export const retrieveHurricaneAwareWindSpeedData: (geometry: PointGeometryQueryParameters) => Promise<Array<HurricaneAwareWindGustFeature>> = (geometry: PointGeometryQueryParameters) => {
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

export const retrieveHurricaneAwarePrecipAmountFeatures: (geometry: PointGeometryQueryParameters) => Promise<Array<HurricaneAwarePrecipFeature>> = (geometry: PointGeometryQueryParameters) => {
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

export const retrieveHurricaneAwarePrecipAccumulationFeatures: (geometry: PointGeometryQueryParameters) => Promise<Array<HurricaneAwarePrecipFeature>> = (geometry: PointGeometryQueryParameters) => {
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
// }