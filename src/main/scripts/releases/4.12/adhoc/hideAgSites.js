const programs = [
    "Climate-Smart Agriculture Program - Capacity Building Grants - Round 1",
    "Climate-Smart Agriculture Program - Capacity Building Grants - Round 2",
    "Climate-Smart Agriculture Program - Partnerships and Innovation Grants"
];
let programIds = db.program.find({name:{$in: programs}}, {_id:false, programId:true}).toArray();
programIds = programIds.map(function (program) {return program.programId;});

db.project.updateMany({programId:{$in: programIds}, status:{$ne:'deleted'}}, {$set:{privateSites:true}});

