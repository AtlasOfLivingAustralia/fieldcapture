package au.org.ala.merit

import asset.pipeline.AssetFile
import asset.pipeline.fs.FileSystemAssetResolver
import org.apache.commons.io.FileUtils

import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.attribute.BasicFileAttributes
import java.nio.file.attribute.FileTime

/*
 * Copyright (C) 2019 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 * 
 * Created by Temi on 12/11/19.
 */

class TemplateFileAssetResolver extends FileSystemAssetResolver {
    String relativeTemplateDirectory
    String relativePathToResource
    String basePath
    File file

    TemplateFileAssetResolver(String name, String basePath, boolean flattenSubDirectories = true, String relativePathToResource, String relativeTemplateDirectory) {
        super(name, basePath, flattenSubDirectories)
        this.relativeTemplateDirectory = relativeTemplateDirectory
        this.relativePathToResource = relativePathToResource
        this.basePath = basePath
    }

    protected Closure<InputStream> createInputStreamClosure(File file) {
        if(file.exists() && !file.isDirectory()) {
            this.file = file
            return {-> file.newInputStream() }
        }
        return null
    }

    AssetFile getAsset(String relativePath, String contentType = null, String extension = null, AssetFile baseFile = null) {
        AssetFile assetFile = super.getAsset(relativePath, contentType, extension, baseFile)
        File file =  new File(this.basePath + relativePath)

        if (this.relativePathToResource.endsWith(relativePath) && (!file?.exists() || doesTemplateNeedCompiling(assetFile))) {
            generateTemplateFile(file)
        }

        return assetFile
    }

    Boolean doesTemplateNeedCompiling (AssetFile file) {
        Boolean compile = false
        if (file != null) {
            BasicFileAttributes attr = Files.readAttributes(Paths.get(this.basePath + this.relativePathToResource), BasicFileAttributes.class)
            FileTime lastModifiedTime = attr.lastModifiedTime()
            def templateFiles = new File(this.basePath + this.relativeTemplateDirectory).listFiles()

            for (templateFile in templateFiles) {
                BasicFileAttributes templateFileAttributes = Files.readAttributes(Paths.get(templateFile.canonicalPath), BasicFileAttributes.class)
                if (templateFileAttributes.lastModifiedTime().compareTo(lastModifiedTime) > 0 ) {
                    return true
                }
            }
        }

        return compile
    }


    void generateTemplateFile(File file) {
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs()
        }

        FileUtils.writeStringToFile(file, '/* Do not edit or commit this file. This file built at compile by _Events.groovy */\n')
        def templates = new File(this.basePath + relativeTemplateDirectory).listFiles()
        templates.each { File template ->
            def fileParts = template.getName().split("\\.")
            if (fileParts.length >= 1) {
                def componentName = fileParts[0]

                if (template.exists()) {
                    def content = template.getText().replaceAll("[\n\r]", "")
                            .replaceAll("\"", "\\\\\"")
                            .replaceAll('\\s+', ' ')
                    FileUtils.writeStringToFile(file,
                            "componentService.setTemplate(\"${componentName}\", \"" + content + "\");", true)
                }
            }
        }
    }
}
