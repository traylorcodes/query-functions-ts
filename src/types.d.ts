

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