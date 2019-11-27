eventCompileEnd = {
    ant.copy(todir: classesDirPath) {
        fileset(file: "${basedir}/grails-app/conf/ala-config.groovy")
    }


    def assetPipelineConfigHolder = classLoader.loadClass('asset.pipeline.AssetPipelineConfigHolder')
    def templateFileAssetResolver = classLoader.loadClass('au.org.ala.ecodata.forms.TemplateFileAssetResolver').newInstance('templates', 'grails-app/assets/components', false, '/compile/templates.js', '/template')

    File file = new File("${basedir}/grails-app/assets/components/compile/templates.js")
    templateFileAssetResolver.generateTemplateFile(file)

    assetPipelineConfigHolder.resolvers.add(0, templateFileAssetResolver)
}