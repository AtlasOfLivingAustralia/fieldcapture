/**
 * The LockService is responsible for managing report and activity locking, and how it interacts with
 * page navigation.
 *
 * As we can't notify the server when the user navigates away from the page by closing the tab/browser etc,
 * the lock manager will write data to local storage indicating that a report/activity was left in a locked state.
 *
 * When later accessing the project page, the LockService will find and release locks that have been left in
 * this state.
 *
 * @param config an object containing the following properties:
 * unlockUrl: The URL that should be used to unlock a report or activity.  (optional)
 */
function LockService(config) {
    var self = this;

    var LOCK_STATE_ACQUIRED = 'acquired';
    var LOCK_STATE_LOCKED_ON_EXIT = 'lockedOnExit';
    var LOCKS_STORAGE_KEY = 'locks'

    function value(entityId, state) {
        return {
            id:entityId,
            state:state,
            date:new Date().toISOString()
        }
    }

    function update(entityId, state) {
        var lockData = amplify.store(LOCKS_STORAGE_KEY);
        if (!lockData) {
            lockData = [];
        }
        var lockEntry = _.find(lockData, function(lock) {
            return lock.id == entityId;
        });

        if (lockEntry) {
            lockEntry.state = state;
        }
        else {
            lockData.push(value(entityId, state));
        }
        amplify.store(LOCKS_STORAGE_KEY, lockData);
    }

    function clear(entityId) {
        var lockData = amplify.store(LOCKS_STORAGE_KEY);
        if (!lockData) {
            console.log("Unable to clear lock for "+entityId+" - lock not found");
            return;
        }
        var lockEntry = _.find(lockData, function(lock) {
            return lock.id == entityId;
        });
        if (!lockEntry) {
            console.log("Unable to clear lock for "+entityId+" - lock not found");
            return;
        }
        lockData = _.without(lockData, lockEntry);
        if (lockData.length == 0) {
            lockData = null;
        }
        amplify.store(LOCKS_STORAGE_KEY, lockData);
    }

    function unlock(entityId) {
        var url = config.unlockUrl+'/'+entityId
        return $.post(url).fail(function() {
            console.log("An error was encountered attempting to unlock a report or activity");
        })
    }

    function shouldUnlock(lock) {
        return lock.state == LOCK_STATE_LOCKED_ON_EXIT;
        // Possibly could also use "acquired" plus the date here, or at least ask the user
        // if they are still editing.
    }

    /**
     * Marks the supplied entity as locked as of the current time.
     * @param entityId the id of the locked entity
     */
    self.lock = function(entityId) {
        console.log("Marking "+entityId+" as locked");
        update(entityId, LOCK_STATE_ACQUIRED);
    }

    /**
     * Deletes the lock for the supplied entity
     * @param entityId the id of the locked entity
     */
    self.clearLock = function(entityId) {
        console.log("Clearing lock for "+entityId);
        clear(entityId);
    }

    /**
     * Marks the supplied entity as having left a locking page while still holding a lock.
     * Flags this lock for cleanup.
     * @param entityId the id of the locked entity
     */
    self.exitingWithLock = function(entityId) {
        console.log("Flagging "+entityId+" to be unlocked - existing without releasing the lock");
        update(entityId, LOCK_STATE_LOCKED_ON_EXIT);
    }

    /**
     * Checks the current lock state for locks in need of releasing, and releases them as
     * required.
     */
    self.unlockAll = function() {
        if (!config.unlockUrl) {
            throw "No unlockUrl supplied to the config";
        }
        var locks = amplify.store(LOCKS_STORAGE_KEY);
        _.each(locks, function(lock) {
            if (shouldUnlock(lock)) {
                unlock(lock.id).done(function() {
                    self.clearLock(lock.id);
                });
            }
        });
    }


}