package pages.modules

import geb.Module

class HistoryApprovedMeriPlansModule extends Module{

    static content = {
        approvalDate {$(".approval-date")}
        ref {$(".ref")}
        comments { $(".comments")}
        approver { $(".approver")}
        open { $(".open")}
        deleteApproval { $(".delete-approval")}

    }
}
