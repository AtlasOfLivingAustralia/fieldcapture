package pages.modules

import geb.Module

class AdminModule extends Module{

    static content = {
        email {$("#email")}
        searchButton {$(".searchUserDetails")}
        firstName { $(".firstName")}
        lastName { $(".lastName")}
        emailAddress { $(".emailAddress")}
        userId { $(".userId")}
        removeButton {$(".removeUserDetails")}

    }
}
