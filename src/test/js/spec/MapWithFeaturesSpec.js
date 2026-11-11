describe("mapWithFeatures convertSourceUploadToFeature", function() {
    beforeEach(function() {
        window.ALA = window.ALA || {};
        window.ALA.MapConstants = window.ALA.MapConstants || {};
        window.ALA.MapConstants.DRAW_TYPE = window.ALA.MapConstants.DRAW_TYPE || {};
        window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE = window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE || "Point";
        window.ALA.MapUtils = window.ALA.MapUtils || {};

        if (!window.ALA.MapUtils.validateGeoJSON) {
            window.ALA.MapUtils.validateGeoJSON = function() { return true; };
        }
    });

    it("returns null when extent source is not upload", function() {
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "Polygon",
                    coordinates: [[[0, 0], [0, 1], [1, 1], [0, 0]]]
                }
            }
        };

        var feature = alaMap.convertSourceUploadToFeature(site);

        expect(feature).toBeUndefined();
    });

    it("returns null when geometry is missing required values", function() {
        var missingGeometry = { extent: { source: "upload" } };
        var missingCoordinates = { extent: { source: "upload", geometry: { type: "Polygon" } } };
        var emptyCoordinates = { extent: { source: "upload", geometry: { type: "Polygon", coordinates: [] } } };
        var missingType = { extent: { source: "upload", geometry: { coordinates: [[[0, 0], [1, 1], [0, 0]]] } } };

        expect(alaMap.convertSourceUploadToFeature(missingGeometry)).toBeUndefined();
        expect(alaMap.convertSourceUploadToFeature(missingCoordinates)).toBeUndefined();
        expect(alaMap.convertSourceUploadToFeature(emptyCoordinates)).toBeUndefined();
        expect(alaMap.convertSourceUploadToFeature(missingType)).toBeUndefined();
    });

    it("returns the feature with merged properties when GeoJSON is valid", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);

        var geometry = {
            type: "Polygon",
            coordinates: [[[0, 0], [0, 1], [1, 1], [0, 0]]],
            label: "outer",
            properties: {
                sourceId: "abc",
                label: "inner"
            }
        };
        var site = {
            extent: {
                source: "upload",
                geometry: geometry
            }
        };

        var feature = alaMap.convertSourceUploadToFeature(site);

        expect(feature.geometry.coordinates).toEqual(geometry.coordinates);
        expect(feature.geometry.type).toBe(geometry.type);
        expect(feature.label).toBeUndefined()
        expect(feature.properties.sourceId).toBe("abc");
        expect(feature.properties.label).toBe("inner");
        expect(feature.properties.coordinates).toBeUndefined();
        expect(feature.properties.type).toBeUndefined();
        expect(feature.properties.properties).toBeUndefined();
    });
});

describe("mapWithFeatures convertSourcePointToFeature", function() {
    beforeEach(function() {
        window.ALA = window.ALA || {};
        window.ALA.MapConstants = window.ALA.MapConstants || {};
        window.ALA.MapConstants.DRAW_TYPE = window.ALA.MapConstants.DRAW_TYPE || {};
        window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE = window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE || "Point";
        window.ALA.MapUtils = window.ALA.MapUtils || {};

        if (!window.ALA.MapUtils.validateGeoJSON) {
            window.ALA.MapUtils.validateGeoJSON = function() { return true; };
        }
    });

    it("returns undefined when extent source is not point", function() {
        var site = {
            extent: {
                source: "upload",
                geometry: {
                    coordinates: [151, -33]
                }
            }
        };

        expect(alaMap.convertSourcePointToFeature(site)).toBeUndefined();
    });

    it("returns undefined when geometry is missing", function() {
        var site = {
            extent: {
                source: "point"
            }
        };

        expect(alaMap.convertSourcePointToFeature(site)).toBeUndefined();
    });

    it("returns a feature with flattened properties when GeoJSON is valid", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);

        var site = {
            extent: {
                source: "Point",
                geometry: {
                    type: "point",
                    coordinates: [151.2, -33.9],
                    label: "outer",
                    properties: {
                        sourceId: "site-1",
                        label: "inner"
                    }
                }
            }
        };

        var feature = alaMap.convertSourcePointToFeature(site);

        expect(feature.type).toBe("Feature");
        expect(feature.geometry.type).toBe(window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE);
        expect(feature.geometry.coordinates).toEqual(site.extent.geometry.coordinates);
        expect(feature.properties.sourceId).toBe("site-1");
        expect(feature.properties.label).toBe("inner");
        expect(feature.properties.coordinates).toBeUndefined();
        expect(feature.properties.type).toBeUndefined();
        expect(feature.properties.properties).toBeUndefined();
    });
});

describe("mapWithFeatures convertSourcePidToFeature", function() {
    beforeEach(function() {
        window.ALA = window.ALA || {};
        window.ALA.MapConstants = window.ALA.MapConstants || {};
        window.ALA.MapConstants.DRAW_TYPE = window.ALA.MapConstants.DRAW_TYPE || {};
        window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE = window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE || "Point";
        window.ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE = window.ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE || "Polygon";
        window.ALA.MapUtils = window.ALA.MapUtils || {};

        if (!window.ALA.MapUtils.validateGeoJSON) {
            window.ALA.MapUtils.validateGeoJSON = function() { return true; };
        }
    });

    it("returns undefined when source is not pid or geometry is missing", function() {
        var nonPidSite = {
            extent: {
                source: "upload",
                geometry: {type: "pid", pid: "cl22"}
            }
        };
        var missingGeometrySite = {
            extent: {
                source: "pid"
            }
        };

        expect(alaMap.convertSourcePidToFeature(nonPidSite)).toBeNull();
        expect(alaMap.convertSourcePidToFeature(missingGeometrySite)).toBeNull();
    });

    it("converts pid geometry to polygon and uses default coordinates when missing", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);

        var site = {
            extent: {
                source: "PID",
                geometry: {
                    type: "pid",
                    pid: "cl22:4321",
                    fid: "fid-1",
                    popup: "Test popup",
                    point_type: "pid"
                }
            }
        };

        var feature = alaMap.convertSourcePidToFeature(site);

        expect(feature.type).toBe("Feature");
        expect(feature.geometry.type).toBe(window.ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE);
        expect(feature.properties.pid).toBe("cl22:4321");
        expect(feature.properties.fid).toBe("fid-1");
        expect(feature.properties.tooltipContent).toBe("Test popup");
        expect(feature.properties.popup).toBeUndefined();
    });

    it("keeps MultiPolygon geometry type and preserves coordinates", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var coordinates = [[[
            [145.0, -38.0],
            [146.0, -38.0],
            [146.0, -37.0],
            [145.0, -38.0]
        ]]];

        var site = {
            extent: {
                source: "pid",
                geometry: {
                    type: "MultiPolygon",
                    pid: "cl23:999",
                    fid: "fid-2",
                    coordinates: coordinates
                }
            }
        };

        var feature = alaMap.convertSourcePidToFeature(site);

        expect(feature.geometry.type).toBe("MultiPolygon");
        expect(feature.geometry.coordinates).toEqual(coordinates);
    });

});

describe("mapWithFeatures convertSourceDrawnToFeature", function() {
    beforeEach(function() {
        window.ALA = window.ALA || {};
        window.ALA.MapConstants = window.ALA.MapConstants || {};
        window.ALA.MapConstants.DRAW_TYPE = window.ALA.MapConstants.DRAW_TYPE || {};
        window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE = window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE || "Point";
        window.ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE = window.ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE || "Polygon";
        window.ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE = window.ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE || "circle";
        window.ALA.MapUtils = window.ALA.MapUtils || {};

        if (!window.ALA.MapUtils.validateGeoJSON) {
            window.ALA.MapUtils.validateGeoJSON = function() { return true; };
        }
    });

    it("converts drawn point geometry into a Feature point", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var coordinates = [151.21, -33.87];
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "Point",
                    coordinates: coordinates,
                    popup: "Point popup"
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);

        expect(feature.type).toBe("Feature");
        expect(feature.geometry.type).toBe("Point");
        expect(feature.geometry.coordinates).toEqual(coordinates);
        expect(feature.properties.tooltipContent).toBe("Point popup");
        expect(feature.properties.popup).toBeUndefined();
    });

    it("converts drawn circle geometry into point geometry with circle point_type", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "circle",
                    centre: [144.9, -37.8],
                    radius: 500
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);

        expect(feature.geometry.type).toBe(window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE);
        expect(feature.geometry.coordinates).toEqual([144.9, -37.8]);
        expect(feature.properties.point_type).toBe(window.ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE);
        expect(feature.properties.type).toBe(window.ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE);
        expect(feature.properties.radius).toBe(500);
    });

    it("keeps non-bounding-box polygon coordinates as drawn geometry", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var coordinates = [[
            [0, 0],
            [0, 2],
            [1, 3],
            [2, 2],
            [2, 0],
            [0, 0]
        ]];
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "Polygon",
                    coordinates: coordinates
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);

        expect(feature.geometry.type).toBe("Polygon");
        expect(feature.geometry.coordinates).toEqual(coordinates);
    });

    it("routes standard bbox polygon with pid through convertSourcePidToFeature", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var pidFeature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [112.0, -44.5],
                        [154.5, -44.5],
                        [154.5, -9.0],
                        [112.0, -9.0],
                        [112.0, -44.5]
                    ]
                ]
            },
            properties: {pid: "cl123", fid: "fid-3", }
        };
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "Polygon",
                    pid: "cl123",
                    fid: "fid-3",
                    coordinates: [[
                        [112.0, -44.5],
                        [154.5, -44.5],
                        [154.5, -9.0],
                        [112.0, -9.0],
                        [112.0, -44.5]
                    ]]
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);
        expect(feature).toEqual(pidFeature);
    });

    it("defaults unknown drawn geometry types to point using centre when GeoJSON is valid", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(true);
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "mystery-shape",
                    centre: [145.1, -37.7],
                    pid: "cl123",
                    fid: "fid-3"
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);

        expect(feature.type).toBe("Feature");
        expect(feature.geometry.type).toBe(window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE);
        expect(feature.geometry.coordinates).toEqual([145.1, -37.7]);
        expect(feature.properties.pid).toBeUndefined()
        expect(feature.properties.fid).toBeUndefined();
    });

    it("returns null for unknown drawn geometry types when generated GeoJSON is invalid", function() {
        spyOn(window.ALA.MapUtils, "validateGeoJSON").and.returnValue(false);
        var site = {
            extent: {
                source: "drawn",
                geometry: {
                    type: "mystery-shape",
                    centre: [145.1, -37.7]
                }
            }
        };

        var feature = alaMap.convertSourceDrawnToFeature(site);

        expect(feature).toBeNull();
    });
});

describe("mapWithFeatures convertOldSiteToFeatureCollection", function() {
    beforeEach(function() {
        window.ALA = window.ALA || {};
        window.ALA.MapConstants = window.ALA.MapConstants || {};
        window.ALA.MapConstants.DRAW_TYPE = window.ALA.MapConstants.DRAW_TYPE || {};
        window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE = window.ALA.MapConstants.DRAW_TYPE.POINT_TYPE || "Point";
        window.ALA.MapUtils = window.ALA.MapUtils || {};
    });

    function makeSite(source) {
        return {
            siteId: "site-1",
            projects: ["p1"],
            name: "Site Name",
            description: "Site Description",
            externalIds: [{idType: "legacy", externalId: "x1"}],
            notes: "Site notes",
            publicationStatus: "published",
            extent: {
                source: source,
                geometry: {
                    type: "Point",
                    coordinates: [151.2, -33.9]
                }
            }
        };
    }

    it("routes drawn source through convertSourceDrawnToFeature and merges properties", function() {
        var site = makeSite("drawn");
        var feature = {
            type: "Feature",
            geometry: {type: "Point", coordinates: [151.2, -33.9]},
            properties: {tooltipContent: "tip", arbitrary: "value", name: "feature-name"}
        };
        spyOn(alaMap, "convertSourceDrawnToFeature").and.returnValue(feature);

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(alaMap.convertSourceDrawnToFeature).toHaveBeenCalledWith(site);
        expect(fc.type).toBe("FeatureCollection");
        expect(fc.features.length).toBe(1);
        expect(fc.features[0]).toBe(feature);
        expect(fc.properties.siteId).toBe("site-1");
        expect(fc.properties.arbitrary).toBe("value");
        // Scaffold properties should win on collisions with feature properties.
        expect(fc.properties.name).toBe("Site Name");
    });

    it("routes pid source through convertSourcePidToFeature with the full site object", function() {
        var site = makeSite("pid");
        var feature = {
            type: "Feature",
            geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]]},
            properties: {pid: "cl22"}
        };
        spyOn(alaMap, "convertSourcePidToFeature").and.returnValue(feature);

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(alaMap.convertSourcePidToFeature).toHaveBeenCalledWith(site);
        expect(fc.features[0]).toBe(feature);
    });

    it("routes point source through convertSourcePointToFeature", function() {
        var site = makeSite("Point");
        var feature = {
            type: "Feature",
            geometry: {type: "Point", coordinates: [151.2, -33.9]},
            properties: {label: "point"}
        };
        spyOn(alaMap, "convertSourcePointToFeature").and.returnValue(feature);

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(alaMap.convertSourcePointToFeature).toHaveBeenCalledWith(site);
        expect(fc.features.length).toBe(1);
        expect(fc.features[0]).toBe(feature);
    });

    it("routes upload source through convertSourceUploadToFeature", function() {
        var site = makeSite("upload");
        site.extent.geometry = {
            type: "Polygon",
            coordinates: [[[0, 0], [0, 1], [1, 1], [0, 0]]]
        };
        var feature = {
            type: "Feature",
            geometry: site.extent.geometry,
            properties: {sourceId: "upload-1"}
        };
        spyOn(alaMap, "convertSourceUploadToFeature").and.returnValue(feature);

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(alaMap.convertSourceUploadToFeature).toHaveBeenCalledWith(site);
        expect(fc.features.length).toBe(1);
        expect(fc.features[0]).toBe(feature);
    });

    it("returns scaffold only when source is none", function() {
        var site = makeSite("none");

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(fc.type).toBe("FeatureCollection");
        expect(fc.features).toEqual([]);
        expect(fc.properties.siteId).toBe("site-1");
        expect(fc.properties.name).toBe("Site Name");
    });

    it("returns scaffold only for unknown source (default behavior)", function() {
        var site = makeSite("mystery-source");

        var fc = alaMap.convertOldSiteToFeatureCollection(site);

        expect(fc.type).toBe("FeatureCollection");
        expect(fc.features).toEqual([]);
        expect(fc.properties.siteId).toBe("site-1");
        expect(fc.properties.publicationStatus).toBe("published");
    });
});

describe("mapWithFeatures fixCoordinatesType", function() {
    it("converts numeric strings in nested coordinates to numbers", function() {
        var coordinates = [["152.6796875", "-27.6603870391846"], ["153.468490600586", "-27.0219631195068"]];

        var fixed = alaMap.fixCoordinatesType(coordinates);

        expect(fixed).toEqual([[152.6796875, -27.6603870391846], [153.468490600586, -27.0219631195068]]);
        expect(typeof fixed[0][0]).toBe("number");
        expect(typeof fixed[0][1]).toBe("number");
    });

    it("keeps existing numeric values unchanged", function() {
        var coordinates = [[[152.5, -27.6], [153.4, -27.0]]];

        var fixed = alaMap.fixCoordinatesType(coordinates);

        expect(fixed).toEqual(coordinates);
    });

    it("returns NaN for non-numeric strings", function() {
        var fixed = alaMap.fixCoordinatesType(["not-a-number"]);

        expect(fixed.length).toBe(1);
        expect(isNaN(fixed[0])).toBe(true);
    });

    it("returns non-array non-string values as is", function() {
        expect(alaMap.fixCoordinatesType(null)).toBeNull();
        expect(alaMap.fixCoordinatesType(undefined)).toBeUndefined();
    });
});

describe("mapWithFeatures isStandardBoundingBoxPolygon", function() {
    it("returns true for a valid standard bounding box polygon", function() {
        var coordinates = [[
            ["152.6796875", "-27.6603870391846"],
            ["152.6796875", "-27.0219631195068"],
            ["153.468490600586", "-27.0219631195068"],
            ["153.468490600586", "-27.6603870391846"],
            ["152.6796875", "-27.6603870391846"]
        ]];

        expect(alaMap.isStandardBoundingBoxPolygon(coordinates)).toBe(true);
    });

    it("returns false when polygon contains holes", function() {
        var coordinates = [
            [[0, 0], [0, 4], [4, 4], [4, 0], [0, 0]],
            [[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]
        ];

        expect(alaMap.isStandardBoundingBoxPolygon(coordinates)).toBe(false);
    });

    it("returns false when ring is not closed", function() {
        var coordinates = [[
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 2]
        ]];

        expect(alaMap.isStandardBoundingBoxPolygon(coordinates)).toBe(false);
    });

    it("returns false when first four points are not unique", function() {
        var coordinates = [[
            [0, 0],
            [0, 1],
            [0, 1],
            [1, 0],
            [0, 0]
        ]];

        expect(alaMap.isStandardBoundingBoxPolygon(coordinates)).toBe(false);
    });

    it("returns false when any edge is diagonal", function() {
        var coordinates = [[
            [0, 0],
            [1, 1],
            [2, 1],
            [2, 0],
            [0, 0]
        ]];

        expect(alaMap.isStandardBoundingBoxPolygon(coordinates)).toBe(false);
    });
});

