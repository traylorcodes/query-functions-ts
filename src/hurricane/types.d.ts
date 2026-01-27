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

export type HurricaneAwareKeyMessageFeature = {
    OBJECTID: number,
    stormName: string,
    message: string
}

export type HurricaneAwareWindGustFeature = {
    OBJECTID: number,
    force: number,
    fromdate: number,
    todate: number,
    label: string
}

export type HurricaneAwarePrecipFeature = {
    OBJECTID: number,
    category: number,
    fromdate: number,
    todate: number,
    label: string
}

export type HurricaneAwareActiveStormsTableFeature = {
    OBJECTID: number,
    stormName: string,
    popUnderAdvisory: number,
    basin: string
};

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

export type HurricaneAwareStormObservedPositionFeature = {
    OBJECTID: number,
    stormName: string,
    totalpop: number,
    basin: string,
    date: number,
    intensity: number
}

export type HurricaneAwareCountyWatchAndWarningFeature = {
    fips: number | null,
    type: string | null
}