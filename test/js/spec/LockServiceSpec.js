describe("The LockService is responsible for tracking and releasing locks when the user leaves reports locked by exiting the page in ways we cannot inform the server" , function () {

    var lockService;
    var unlockUrl = '/activity/unlock';
    beforeEach(function() {

        lockService = new LockService({unlockUrl:unlockUrl});

        spyOn($, 'post').and.callFake(function () {
            var d = $.Deferred();
            // resolve using our mock data
            d.resolve({success:true});
            return d.promise();
        });
    });

    it("Can track a lock as needing to be released", function() {
        var activityId = 'a1'

        lockService.lock(activityId);

        lockService.exitingWithLock(activityId);

        lockService.unlockAll();

        expect($.post).toHaveBeenCalledWith(unlockUrl+'/'+activityId);
        expect($.post.calls.count()).toEqual(1);
        lockService.unlockAll();

        expect($.post.calls.count()).toEqual(1); // The lock should have been cleared so this won't be called a second time.

    });

    it("It can clear a lock when the page is exited normally", function() {
        var activityId = 'a1'

        lockService.lock(activityId);

        lockService.clearLock(activityId);

        lockService.unlockAll();

        expect($.post.calls.count()).toEqual(0); // The lock should have been cleared so this won't be called a second time.

    });

    it("It can support multiple locks", function() {
        var activityId1 = 'a1'
        var activityId2 = 'a2'

        lockService.exitingWithLock(activityId1);
        lockService.exitingWithLock(activityId2);

        lockService.unlockAll();

        expect($.post.calls.count()).toEqual(2); // The lock should have been cleared so this won't be called a second time.

    });

});
