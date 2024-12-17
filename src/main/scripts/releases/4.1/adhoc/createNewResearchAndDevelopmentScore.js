load('../../utils/audit.js');
let adminUserId = '<tbd>'
let scores = [
  {
    scoreId: UUID.generate(),
    entityTypes: undefined,
    tags: [],
    displayType: '',
    entity: 'Activity',
    outputType: 'Research and Development',
    isOutputTarget: false,
    category: 'Reporting',
    status: 'active',
    label: 'Invoiced number of hours conducting research and development',
    description: '',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Research and development',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.noHoursConductingResearchAndDevelopmentInvoiced',
              type: 'SUM'
            }
          ]
        }
      ]
    }
  }
  ,
  {
    _id: ObjectId('664c25abb61a6108c799ea73'),
    scoreId: UUID.generate(),
    label: 'Number of hours conducting research and development',
    status: 'active',
    isOutputTarget: true,
    category: 'RLP and Bushfire Recovery',
    outputType: 'Research and Development',
    configuration: {
      childAggregations: [
        {
          filter: {
            property: 'name',
            filterValue: 'NHT - Research and development',
            type: 'filter'
          },
          childAggregations: [
            {
              property: 'data.noHoursConductingResearchAndDevelopment',
              type: 'SUM'
            }
          ]
        }
      ]
    },
    dateCreated: ISODate('2024-12-17T04:40:11.160Z'),
    lastUpdated: ISODate('2024-12-17T04:40:11.160Z')
  }];


for (let i=0; i<scores.length; i+=2) {
  let invoiced = scores[i];
  let delivered = scores[i+1];

  audit(invoiced, invoiced.scoreId, 'au.org.ala.ecodata.Score', adminUserId, null, 'Insert');
  db.score.insertOne(invoiced);

}
