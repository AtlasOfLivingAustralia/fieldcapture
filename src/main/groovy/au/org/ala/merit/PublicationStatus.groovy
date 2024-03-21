package au.org.ala.merit

class PublicationStatus {
    public static final String APPROVED = 'published'
    public static final String SUBMITTED = 'pendingApproval'
    public static final String NOT_APPROVED = 'unpublished'
    public static final String CANCELLED = 'cancelled'

    static boolean isReadOnly(publicationStatus) {
        // A null/blank publication status is treated the same as a NOT_APPROVED status
        publicationStatus == APPROVED || publicationStatus == SUBMITTED || publicationStatus == CANCELLED
    }

    static boolean isApproved(publicationStatus) {
        publicationStatus == APPROVED
    }

    /** A status indicates the item requires further action when it is not yet approved or cancelled */
    static boolean requiresAction(publicationStatus) {
        publicationStatus != APPROVED && publicationStatus != CANCELLED
    }
}
