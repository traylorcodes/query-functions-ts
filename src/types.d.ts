

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

export type FipsOrGeometryQueryOptions = {
    countyFIPS?: string,
    geometry?: {
        spatialReference: number,
        x: number,
        y: number
    },
    token?: string
};

export type PointGeometryQueryParameters = {
    spatialReference: number,
    x: number,
    y: number,
}


// the format that the function returns data in
export type CountyAndStateRequest = {
    NAME: string,
    State: string,
};

export type GetFipsRequest = {GEOID: string};

export type DroughtPopRequest = {
    P0010001_D0: number,
    P0010001_D1: number,
    P0010001_D2: number,
    P0010001_D3: number,
    P0010001_D4: number,
    P0010001_Dx: number,
    P0020002_Dx: number,
    P0020003_Dx: number,
};

export type DroughtHousingRequest = {
    H0010001_Dx: number,
    H0010001_D4: number,
    H0010001_D3: number,
    H0010001_D2: number,
    H0010001_D1: number,
    H0010001_D0: number,
};

export type PopulationDataRequest = {
    P0010001: number,
    P0020002: number,
    P0020003: number,
};

export type HousingDataRequest = {
    H0010001: number,
};