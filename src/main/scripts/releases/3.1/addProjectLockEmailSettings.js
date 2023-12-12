function addSetting(key, value) {
    db.setting.insert({key:key, value:value});
}
addSetting('meritfielddata.project_lock.subject', "Your MERI Plan edits have been interrupted");
addSetting('meritfielddata.project_lock.body', "User ${user} has elected to edit a MERI Plan that you may be currently editing.  If you have finished editing and saved your changes then you don't need to do anything.\n" +
    "If you are currently editing the MERI Plan, you may need to contact ${user} and ask them to allow you to finish before proceeding with their edits.\n" +
    "\n" +
    "The related project is: ${url}");



