package pages

import geb.Page

class AdminStaticPages extends Page {
    static url = '/admin/staticPages'

    static at = { title == 'Static pages | Admin | MERIT'}
}
