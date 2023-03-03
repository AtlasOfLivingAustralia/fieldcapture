load('../../utils/uuid.js');
db.service.remove({});
const services = [
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Baseline data"}],
        "name": "Collecting, or synthesising baseline data",
        "id": NumberInt(1),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Communication materials"}],
        "name": "Communication materials",
        "id": NumberInt(2),
        "categories": ["Complimentary"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Community engagement"}],
        "name": "Community/stakeholder engagement",
        "id": NumberInt(3),
        "categories": ["Complimentary"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Controlling access"}],
        "name": "Controlling access",
        "id": NumberInt(4),
        "categories": [
            "Managing threats",
            "Improve habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Pest animal management"}],
        "name": "Controlling pest animals",
        "id": NumberInt(5),
        "categories": ["Managing threats"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Debris removal"}],
        "name": "Debris removal",
        "id": NumberInt(34),
        "categories": ["Restoring condition"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Management plan development"}],
        "name": "Developing farm/project/site management plan",
        "id": NumberInt(6),
        "categories": ["Complimentary"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Erosion Management"}],
        "name": "Erosion management",
        "id": NumberInt(7),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Establishing Agreements"}],
        "name": "Establishing and maintaining agreements",
        "id": NumberInt(8),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Maintaining feral free enclosures"}],
        "name": "Establishing and maintaining feral-free enclosures",
        "id": NumberInt(9),
        "categories": ["Create safe havens"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Establishing ex-situ breeding programs"}],
        "name": "Establishing and maintaining breeding programs",
        "id": NumberInt(10),
        "categories": ["Create safe havens"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Establishing monitoring regimes"}],
        "name": "Establishing and maintaining monitoring regimes",
        "id": NumberInt(11),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Farm Management Survey"}],
        "name": "Farm management survey",
        "id": NumberInt(12),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Fauna survey"}],
        "name": "Fauna survey",
        "id": NumberInt(13),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Fire management"}],
        "name": "Fire management actions",
        "id": NumberInt(14),
        "categories": [
            "Managing threats",
            "Imroving habitat"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Flora survey"}],
        "name": "Flora survey",
        "id": NumberInt(15),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Habitat augmentation"}],
        "name": "Habitat augmentation",
        "id": NumberInt(16),
        "categories": ["Improving habitat"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Identifying sites"}],
        "name": "Identifying the location of potential sites",
        "id": NumberInt(17),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Improving hydrological regimes"}],
        "name": "Improving hydrological regimes",
        "id": NumberInt(18),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Improving land management practices"}],
        "name": "Improving land management practices",
        "id": NumberInt(19),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Disease management"}],
        "name": "Managing disease",
        "id": NumberInt(20),
        "categories": ["Managing threats"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Negotiations"}],
        "name": "Negotiating with the Community, Landholders, Farmers, Traditional Owner groups, Agriculture industry groups etc.",
        "id": NumberInt(21),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Obtaining approvals"}],
        "name": "Obtaining relevant approvals",
        "id": NumberInt(22),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Pest animal survey"}],
        "name": "Pest animal survey",
        "id": NumberInt(23),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Plant survival survey"}],
        "name": "Plant survival survey",
        "id": NumberInt(24),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Project planning"}],
        "name": "Project planning and delivery of documents as required for the delivery of the Project Services and monitoring",
        "id": NumberInt(25),
        "categories": ["Project initiation activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Remediating riparian and aquatic areas"}],
        "name": "Remediating riparian and aquatic areas",
        "id": NumberInt(26),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Weed treatment"}],
        "name": "Removing weeds",
        "id": NumberInt(27),
        "categories": ["Managing threats"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Revegetating habitat"}],
        "name": "Revegetating habitat",
        "id": NumberInt(28),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"Seed Collecting - Bushfire Program"}],
        "name": "Seed collection",
        "id": NumberInt(36),
        "categories": [
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Site preparation"}],
        "name": "Site preparation",
        "id":NumberInt(35),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Skills and knowledge survey"}],
        "name": "Skills and knowledge survey",
        "id": NumberInt(29),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Soil testing"}],
        "name": "Soil testing",
        "id": NumberInt(30),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Emergency Interventions"}],
        "name": "Undertaking emergency interventions to prevent extinctions",
        "id": NumberInt(31),
        "categories": [
            "Improving habitat",
            "Restore site condition"
        ]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Water quality survey"}],
        "name": "Water quality survey",
        "id": NumberInt(32),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"RLP - Weed distribution survey"}],
        "name": "Weed distribution survey",
        "id": NumberInt(33),
        "categories": ["Monitoring activities"]
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"Cultural value survey and/or assessment"}],
        "name": "Cultural value survey and/or assessment",
        "id": NumberInt(37)
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"Cultural Site Management"}],
        "name": "Cultural Site Management",
        "id": NumberInt(38)
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"On Country Visits"}],
        "name": "On Country Visits",
        "id": NumberInt(39)
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"Cultural Practices"}],
        "name": "Cultural Practices",
        "id": NumberInt(40)
    },
    {
        "outputs": [{"formName": "RLP Output Report", "sectionName":"Developing/updating Guidelines/Protocols/Plans"}],
        "name": "Developing/updating Guidelines/Protocols/Plans",
        "id": NumberInt(41)
    }
];

for (let i=0; i<services.length; i++) {
    var service = services[i];
    service.legacyId = service.id;
    delete service.id;
    service.serviceId = UUID.generate();
    service.status = 'active';
    db.service.insertOne(service);
}