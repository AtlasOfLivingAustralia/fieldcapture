package au.org.ala.merit

enum BlogType{
    PROJECT, SITE, PROGRAM, MANAGEMENTUNIT

    /**
     * Case-insensitive value check
     * @param value
     * @return
     */
     static BlogType lookup(String value) {
        for(BlogType v : BlogType.values())
            if(v.name().equalsIgnoreCase(value)) return v;
        throw new IllegalArgumentException();
    }
}