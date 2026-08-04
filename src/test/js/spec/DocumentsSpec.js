describe("The documents contains view models for working with documents", function() {

    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
    });
    afterAll(function() {
        delete window.fcConfig;
    });

    it("Can decide whether document roles are public based on metadata", function() {

        var documentViewModel = new DocumentViewModel({}, {projectId:'p1'});

        expect(documentViewModel.hasPublicRole()).toBeFalsy();

        _.each(documentRoles, function(role) {

            documentViewModel.public(true);
            documentViewModel.role(role.id);

            // The view fires this event on change.
            documentViewModel.onRoleChange(role.id);

            expect(documentViewModel.hasPublicRole()).toEqual(role.isPublicRole);
            if (!role.isPublicRole) {
                expect(documentViewModel.public()).toBeFalsy();
            }
        });

    });

    describe("parseEmbeddedVideoOrUrl", function() {

        it("returns null for empty or non-string input", function() {
            expect(parseEmbeddedVideoOrUrl(null)).toBeNull();
            expect(parseEmbeddedVideoOrUrl(undefined)).toBeNull();
            expect(parseEmbeddedVideoOrUrl('')).toBeNull();
            expect(parseEmbeddedVideoOrUrl(123)).toBeNull();
        });

        it("returns null for unsupported URLs", function() {
            expect(parseEmbeddedVideoOrUrl('https://example.com/video.mp4')).toBeNull();
        });

        it("parses a YouTube watch URL", function() {
            var result = parseEmbeddedVideoOrUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            expect(result).not.toBeNull();
            expect(result.type).toEqual('youtube');
            expect(result.videoId).toEqual('dQw4w9WgXcQ');
            expect(result.domain).toEqual('youtube.com');
        });

        it("parses a YouTube embed URL", function() {
            var result = parseEmbeddedVideoOrUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
            expect(result.type).toEqual('youtube');
            expect(result.videoId).toEqual('dQw4w9WgXcQ');
        });

        it("parses a YouTube iframe embed", function() {
            var iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0"></iframe>';
            var result = parseEmbeddedVideoOrUrl(iframe);
            expect(result.type).toEqual('youtube');
            expect(result.videoId).toEqual('dQw4w9WgXcQ');
            expect(result.width).toEqual('560');
            expect(result.height).toEqual('315');
        });

        it("parses a Vimeo URL", function() {
            var result = parseEmbeddedVideoOrUrl('https://vimeo.com/123456789');
            expect(result).not.toBeNull();
            expect(result.type).toEqual('vimeo');
            expect(result.videoId).toEqual('123456789');
            expect(result.domain).toEqual('vimeo.com');
        });

        it("parses a Vimeo player URL", function() {
            var result = parseEmbeddedVideoOrUrl('https://player.vimeo.com/video/123456789');
            expect(result.type).toEqual('vimeo');
            expect(result.videoId).toEqual('123456789');
        });

        it("parses a Facebook video plugin URL", function() {
            var result = parseEmbeddedVideoOrUrl('https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1234567890');
            expect(result).not.toBeNull();
            expect(result.type).toEqual('facebook');
            expect(result.videoId).toEqual('1234567890');
            expect(result.domain).toEqual('facebook.com');
        });

        it("decodes HTML entities in the matched URL", function() {
            var iframe = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?feature=oembed&amp;rel=0"></iframe>';
            var result = parseEmbeddedVideoOrUrl(iframe);
            expect(result.url).toEqual('https://www.youtube.com/embed/dQw4w9WgXcQ?feature=oembed&rel=0');
        });

    });

});
