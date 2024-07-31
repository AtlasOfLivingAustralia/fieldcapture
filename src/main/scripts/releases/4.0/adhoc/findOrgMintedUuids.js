let ids = ["3324b931-9b03-4ce0-895c-54a01c87aaae",
"2160bed1-e704-45ad-b8f9-23b1cdda8111",
"562e4287-087c-4efb-a3da-89175f76bb35",
"39a45896-4b79-4404-954e-ed2bab885932",
"1d62c4a8-be31-43f5-b795-a4457f13861c",
"d02e4fdf-422d-4b4a-b685-066fe453c369",
"ac1c332d-27bb-4e03-aedd-a596fbe4f070",
"13adb9b8-8305-4583-8326-e538f8240f4c",
"a91086d2-d8b0-4d1b-a64c-89a138925077",
"3ecdf6ef-d0e5-4e8e-b791-be0a9d5f5422",
"3fbf9764-3d3a-4572-bc11-2333761c9f4e",
"15b3a7db-8053-412f-8193-a619e2fe6677",
"900e7a7d-1e81-4887-9f6e-ae745cf3aaf8",
"e6abafa8-e06c-4df1-8683-d4933894b623",
"0f34323b-9c55-4970-a3cc-489ed62d04bc",
"4c6a857d-58fe-4d09-ae0d-8b9fdbfcd0d1",
"338b2e0e-cb61-47b4-98f2-23d58091f255",
"85f1e9f1-c91d-44a1-96ff-ccec4082f378",
"e6f86e8d-e319-4a67-b276-98a1cb012a24",
"f3bc827c-fd0c-4bf5-981d-71d981d68196",
"96695f4b-23fb-480f-b987-08d01e0aa064",
"d8f6c190-6530-45c7-9178-10fbe9e2b114",
"748413dd-9c6f-40dd-8b60-ea91e501ee80",
"e6523323-b1e3-4c89-8add-7c37f1898b46",
"1c892f75-32ae-4c91-8a76-7b3ac0715b36",
"0cd6096b-5d50-470f-b86f-139993def469",
"403f4c90-bfaa-491d-8d34-fdd90ed57ffb"];

for (let id of ids) {
    let projects = db.project.find({'custom.dataSets.surveyId.survey_metadata.survey_details.uuid':id});
    if (!projects.hasNext()) {
        print("Survey uuid: " + id+ " not found");
    }
    else if (projects.size() > 1) {
        print("Multiple projects found for survey id: " + id);
    }
    else {
        let project = projects.next();
        let dataSets = project.custom.dataSets;
        for (let i = 0; i < dataSets.length; i++) {
            if (dataSets[i].surveyId) {
                if (dataSets[i].surveyId.survey_metadata.survey_details.uuid == id) {
                    print(id+","+project.custom.dataSets[i].surveyId.survey_metadata.orgMintedUUID);
                }
            }

        }
    }
}
