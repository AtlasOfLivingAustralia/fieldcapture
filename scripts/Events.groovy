eventCompileEnd = {
    ant.copy(todir:classesDirPath) {
        fileset(file:"${basedir}/grails-app/conf/ala-config.groovy")
    }
}