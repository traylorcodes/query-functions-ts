/*
    Modules to help retrieve data from feature services
*/



// export const test: () => void = () => {

// }

// export test;

// export type test = {

// }






export * from './hurricane/hurricane';
export * from './drought/drought';
export { reverseGeocodePoint } from './utility';




// export * from './utility';
// export * as utilityFunctions from './utility';






// import config from './config.json';
// import * as types from './types';
// import * from require('./hurricane/functions');
// export * from './hurricane/functions';
// export * from './utilityFunctions';





// import * as hurricane from './hurricane/functions';
// const stormFunctions = require('./StormFunctions');

// export * as hurricaneQueries from './hurricane/functions';

// export type CountyAndStateRequest = types.CountyAndStateRequest;
// export type GetFipsRequest = types.GetFipsRequest;
// export type DroughtPopRequest = types.DroughtPopRequest;
// export type DroughtHousingRequest = types.DroughtHousingRequest;
// export type PopulationDataRequest = types.PopulationDataRequest;
// export type HousingDataRequest = types.HousingDataRequest;
// export type PointGeometryQueryParameters = types.PointGeometryQueryParameters;

// export type HurricaneAwareCountyTableReturnFeature = hurricane.HurricaneAwareCountyTableReturnFeature;
// export type HurricaneAwareKeyMessageFeature = hurricane.HurricaneAwareKeyMessageFeature;
// export type HurricaneAwareWindGustFeature = hurricane.HurricaneAwareWindGustFeature;
// export type HurricaneAwarePrecipFeature = hurricane.HurricaneAwarePrecipFeature;
// export type HurricaneAwareActiveStormsTableFeature = hurricane.HurricaneAwareActiveStormsTableFeature;
// export type HurricaneAwareStormForecastFeature = hurricane.HurricaneAwareStormForecastFeature;
// export type HurricaneAwareStormObservedPositionFeature = hurricane.HurricaneAwareStormObservedPositionFeature;

// export function (fips: number) => Promise<Array<HurricaneAwareCountyTableReturnFeature>> = hurricane.retrieveHurricaneTableCountyData;

// export type HurricaneAwareCountyTableReturnFeature = {
//     attributes: {
//         fips: number | null,
//         state: string | null,
//         county: string | null,
//         totalPop: number | null,
//         totalHouseholds: number | null,
//         popUnder18: number | null,
//         percentPopUnder18: number | null,
//         popOver64: number | null,
//         percentPopOver64: number | null,
//         popDisabled: number | null,
//         percentPopDisabled: number | null,
//         popInNursing: number | null,
//         mobileHomeHouseholds: number | null,
//         percentMobileHomeHouseholds: number | null,
//         noVehicleHouseholds: number | null,
//         percentNoVehicleHouseholds: number | null,
//         householdsWithPets: number | null,
//         percentPetHouseholds: number | null,
//         popOver18LimitedEnglish: number | null,
//         percentPopOver18LimitedEnglish: number | null,
//         noSmartphoneHouseholds: number | null,
//         percentNoSmartphoneHouseholds: number | null,
//         noInternetHouseholds: number | null,
//         percentNoInternetHouseholds: number | null,
//         communityResilience: string | null,
//         currentRiskRating: string | null,
//         futureRiskRating: string | null,
//     }
//     geometry: { rings: Array<Array<number>> },
//     spatialReferenceWkid: number
// }

// export type HurricaneAwareKeyMessageFeature = {
//     OBJECTID: number,
//     stormName: string,
//     message: string
// }

// export type HurricaneAwareWindGustFeature = {
//     OBJECTID: number,
//     force: number,
//     fromdate: number,
//     todate: number,
//     label: string
// }

// export type HurricaneAwarePrecipFeature = {
//     OBJECTID: number,
//     category: number,
//     fromdate: number,
//     todate: number,
//     label: string
// }

// export type HurricaneAwareActiveStormsTableFeature = {
//     OBJECTID: number,
//     stormName: string,
//     popUnderAdvisory: number,
//     basin: string
// };

// export type HurricaneAwareStormForecastFeature = {
//     OBJECTID: number,
//     stormName: string,
//     basin: string,
//     advisoryDate: number,
//     dateLabel: string,
//     fullDate: string,
//     maxWind: number,
//     gust: number,
//     TCDVLP: string,
//     STORMSRC: string
// }

// export type HurricaneAwareStormObservedPositionFeature = {
//     OBJECTID: number,
//     stormName: string,
//     totalpop: number,
//     basin: string,
//     date: number,
//     intensity: number
// }

// export type HurricaneAwareCountyWatchAndWarningFeature = {
//     fips: number | null,
//     type: string | null
// }


// const generateUrlParams = (serviceUrl: string, options: any, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean): string => {
//     // replace where clause with 1=1 if it is null
//     if (!options.where && !reverseGeocoding && !queryingItemJSON) {
//         options.where = '1=1';
//     }

//     let outFieldsParam: string = '';
//     if (options.outFields) {
//         outFieldsParam = `&outFields=${options.outFields.join('%2C+')}`;
//         delete options.outFields;
//     }

//     return serviceUrl + (queryingRelatedFeatures ? '/queryRelatedRecords?' : reverseGeocoding ? '/reverseGeocode?' : queryingItemJSON ? '' : '/query?') + new URLSearchParams({
//         ...options,
//         f: 'json'
//     }).toString() + outFieldsParam;
// }

// function executeQuery(url: string, returnAttributesOnly: boolean, resolve: (value: any) => void, reject: (reason?: any) => void, queryingRelatedFeatures?: boolean, reverseGeocoding?: boolean, queryingItemJSON?: boolean) {
//     try {
//         fetch(url)
//             .then((response) => {
//                 response.json().then(
//                     (data) => {
//                         if (data.error) {
//                             reject(data.error);
//                             // reject(url)
//                             return;
//                         }
//                         if (reverseGeocoding || queryingItemJSON) {
//                             resolve(data);
//                             return;
//                         }
//                         const temp: Array<any> = [];
//                         if (queryingRelatedFeatures) {
//                             data.relatedRecordGroups[0]?.relatedRecords?.forEach((feature: any) => {
//                                 temp.push(feature.attributes);
//                             });
//                         }
//                         else {
//                             data.features.forEach((feature: types.Point | types.Polygon | types.Polyline) => {
//                                 if (returnAttributesOnly) {
//                                     temp.push(feature.attributes)
//                                 }
//                                 else temp.push(
//                                     {
//                                         attributes: feature.attributes,
//                                         spatialReferenceWkid: data.spatialReference.wkid ?? null,
//                                         geometry: feature.geometry ?? null
//                                     }
//                                 );
//                             });
//                         }
//                         resolve(temp);
//                         // resolve(data);
//                     },
//                     (rejectedReason) => {
//                         reject(rejectedReason);
//                     })
//                     .catch((e) => {
//                         reject(e);
//                         // reject(url);
//                     })
//             },
//                 (rejectedReason) => {
//                     reject(rejectedReason);
//                 }
//             )

//     } catch (e) {
//         reject(e);
//     }
// }

// export const reverseGeocodePoint: (geometry: PointGeometryQueryParameters) => Promise<any> = (geometry: PointGeometryQueryParameters) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
//                 {
//                     location: `${geometry.x},${geometry.y}`,
//                     cacheHint: true,
//                 }, false, true
//             )
//             , true, resolve, reject, false, false, true);
//     })
// }

// export const retrieveListOfNationalDroughtLevelPeriods: any = () => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 config.nationalDroughtServiceUrl,
//                 {
//                     outFields: [config.nationalAndWaterDroughtLevelTimeFields],
//                     returnGeometry: false,
//                     cacheHint: true,
//                 },
//                 false
//             )
//             , true, resolve, reject, false)
//     });
// }

// export const retrieveDroughtLevelData: any = (
//     featureCategory: 'county' | 'state' | 'nation' | 'water',
//     id?: string
// ) => {
//     let serviceUrl: string = '';
//     let where = '1=1';
//     switch (featureCategory) {
//         case ('county'):
//             serviceUrl = config.countyDroughtServiceUrl
//             where = `${config.droughtServiceFipsFieldName} = '${id}'`
//             where
//             break;
//         case ('state'):
//             serviceUrl = config.stateDroughtServiceUrl
//             where = `${config.droughtServiceFipsFieldName} = '${id}'`
//             break;
//         case ('nation'):
//             serviceUrl = config.nationalDroughtServiceUrl
//             break;
//         case ('water'):
//             serviceUrl = config.waterDroughtServiceUrl;
//             where = `huc4 = '${id}'`
//             break;
//     }

//     return new Promise((resolve, reject) => {

//         executeQuery(
//             generateUrlParams(
//                 serviceUrl,

//                 {
//                     outFields: [
//                         ['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtLevelOutFields : config.nationalDroughtLevelOutFields,
//                         ['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtLevelTimeFields : config.nationalAndWaterDroughtLevelTimeFields,
//                         // ['county', 'state'].find((c: string) => c === featureCategory) !== undefined ? config.droughtServiceFipsFieldName : ''
//                     ],
//                     where: where,
//                     returnGeometry: false,
//                     orderByFields: `${['county', 'state'].find((f: string) => f === featureCategory) ? config.droughtDateFieldName : config.nationalAndWaterDroughtFieldName} DESC`,
//                     cacheHint: true,
//                 }
//             )
//             , true, resolve, reject)
//     });
// }

// export const getPopulationServiceData:
//     (
//         getCountyOrStateData: 'county' | 'state',
//         geometry: PointGeometryQueryParameters,
//         returnIdInformationData: boolean,
//         returnPopulationData: boolean,
//         returnHousingData: boolean,
//         returnAgricultureData: boolean,
//         returnEconomicImpactData: boolean,
//         getAgriValue: boolean,
//     ) => Promise<any> =
//     (
//         getCountyOrStateData: 'county' | 'state',
//         geometry: PointGeometryQueryParameters,
//         returnIdInformationData: boolean,
//         returnPopulationData: boolean,
//         returnHousingData: boolean,
//         returnAgricultureData: boolean,
//         returnEconomicImpactData: boolean,
//         getAgriValue: boolean,

//     ) => {
//         // make call
//         // what return?? put in out fields
//         return new Promise((resolve, reject) => {
//             executeQuery(
//                 generateUrlParams(
//                     getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
//                     {
//                         outFields: [
//                             returnIdInformationData ? (getCountyOrStateData === 'county' ? config.countyIdInformationOutFields : config.stateIdInformationOutFields) : '',
//                             returnPopulationData ? config.populationFields : '',
//                             returnHousingData ? config.housingFields : '',
//                             returnAgricultureData ? config.agricultureLayerFields : '',
//                             getCountyOrStateData === 'county' ? config.socialAndCommunityPopulationFields : '',
//                             returnEconomicImpactData && getCountyOrStateData === 'county' ? config.countyEconomicImpactPopulationFields : '',
//                             returnEconomicImpactData && getCountyOrStateData === 'state' ? config.stateEconomicImpactPopulationFields : '',
//                             getAgriValue ? 'AGRIVALUE' : ''
//                         ],
//                         geometry: `{"x": ${geometry.x},"y": ${geometry.y},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
//                         inSR: geometry.spatialReference,
//                         outSR: 4326,
//                         geometryType: 'esriGeometryPoint',
//                         returnGeometry: true,
//                         geometryPrecision: 4,
//                         resultType: 'tile',
//                         cacheHint: true,
//                     }
//                 )
//                 , false, resolve, reject)
//         });
//     }

// export const getPopulationHistory: any = (getCountyOrStateData: 'county' | 'state', objectId: number) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
//                 {
//                     outFields: ['*'],
//                     objectIds: [objectId],
//                     relationshipId: getCountyOrStateData === 'county' ? config.countyTableRelationshipId : config.stateTableRelationshipId,
//                     returnGeometry: false,
//                     cacheHint: true,
//                 },
//                 true
//             )
//             , true, resolve, reject, true)
//     });
// }

// export const getAgricultureHistory: any = (getCountyOrStateData: 'county' | 'state', objectId: number) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 getCountyOrStateData === 'county' ? config.countyPopulationServiceUrl : config.statePopulationServiceUrl,
//                 {
//                     outFields: ['*'],
//                     objectIds: [objectId],
//                     relationshipId: getCountyOrStateData === 'county' ? config.countyAgricultureRelationshipId : config.stateAgricultureRelationshipId,
//                     returnGeometry: false,
//                     cacheHint: true,
//                 },
//                 true
//             )
//             , true, resolve, reject, true)
//     });
// }

// export const getHuc4WatershedData: (
//     geometry: PointGeometryQueryParameters
// ) => any = (geometry: PointGeometryQueryParameters) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 config.watershedHuc4LayerServiceUrl,
//                 {
//                     geometry: `{"x": ${geometry.x.toPrecision(6)},"y": ${geometry.y.toPrecision(6)},"spatialReference": {"wkid": ${geometry.spatialReference}}}`,
//                     inSR: geometry.spatialReference,
//                     outFields: ['objectid', 'huc4 as HUC4', 'name as NAME'],
//                     // outFields: ['*'],
//                     outSR: 4326,
//                     geometryType: 'esriGeometryPoint',
//                     returnGeometry: true,
//                     geometryPrecision: 4,
//                     resultType: 'tile',
//                     cacheHint: true,
//                 }
//             ), false, resolve, reject
//         );
//     });
// }

// export const getFlowlineData: (huc4ID: string) => any = (huc4ID: string) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 config.flowlinesLayerServiceUrl,
//                 {
//                     // huc4: huc4ID,
//                     where: `huc4 = '${huc4ID}'`,
//                     outFields: ['*'],
//                     returnGeometry: false,
//                     cacheHint: true,
//                 }
//             ), true, resolve, reject
//         )
//     });
// }

// export const getRelatedFlowsData: (featureID: string) => any = (featureID: string) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 config.nwmFlowsTableUrl,
//                 {
//                     where: `feature_id = '${featureID}'`,
//                     outFields: ['*'],
//                     cacheHint: true,
//                 }
//             ), true, resolve, reject
//         )
//     });
// }

// export const getLocalReservoirData: (huc4ID: string) => any = (huc4ID: string) => {
//     return new Promise((resolve, reject) => {
//         executeQuery(
//             generateUrlParams(
//                 config.nidSubsetTableUrl,
//                 {
//                     where: `huc4 = '${huc4ID}'`,
//                     outFields: ['*'],
//                     cacheHint: true,
//                 }
//             ), true, resolve, reject
//         )
//     });
// }