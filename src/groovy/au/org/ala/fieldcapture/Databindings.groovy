package au.org.ala.fieldcapture

import au.org.ala.fieldcapture.AttributeMap

class Databindings extends AttributeMap {
    Databindings() {
        super(COMMA)
    }

    def add(key, value) {
        map[key] = value
    }

    String toString() {
        map.collect({k,v -> k + COLON + v}).join separator
    }
}
