db.setting.updateOne({key:'meritfielddata.title.text'}, {$set:{value: 'Use the facets on the left to narrow the selection of projects on the map'}});
db.setting.updateOne({key:'meritfielddata.helpLinksTitle.text'}, {$set:{value:'<h2>Helpful links</h2>'}});
db.setting.updateOne({key:'meritfieldata.footer.text'},{$set:{value: 'While efforts are made to ensure the accuracy of the ecological information contained in MERIT, for confirmation of authoritative data please contact the Department of Climate Change, Energy, the Environment and Water.\r\n' +
'\r\n' +
'This site has been developed by the **<a href="https://www.ala.org.au" rel="external">Atlas of Living Australia</a>** in 2013. Please report issues to <strong>[MERIT@dcceew.gov.au](mailto:MERIT@dcceew.gov.au)</strong>\r\n' +
'\r\n' +
'<div>© 2014 <strong><a href="http://www.nrm.gov.au/about/copyright.html" rel="external">Commonwealth of Australia</a></div></strong>'}});