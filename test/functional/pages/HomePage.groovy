package pages

import geb.Page
import pages.modules.box1
import pages.modules.box2
import pages.modules.box3
import pages.modules.box4
import pages.modules.box5
import pages.modules.box6

class HomePage extends Page {

    static url = ""

    static at = { title == "Home | MERIT"}

    static content = {
        box1{ $(".box1").moduleList(box1)}
        box2{ $(".box2").moduleList(box2)}
        box3{ $(".box3").moduleList(box3)}
        box4{ $(".box4").moduleList(box4)}
        box5{ $(".box5").moduleList(box5)}
        box6{ $(".box6").moduleList(box6)}
    }
}
