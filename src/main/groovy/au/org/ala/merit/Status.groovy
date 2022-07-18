package au.org.ala.merit

/** Constants that represent possible values for the status fields of entities */
class Status {
    public static final String ACTIVE = 'active';
    public static final String DELETED = 'deleted';
    public static final String READ_ONLY = 'readonly';

    static boolean isReadOnly(String status) {
        READ_ONLY.equalsIgnoreCase(status)
    }

    static boolean isActive(String status) {
        ACTIVE.equalsIgnoreCase(status)
    }
}