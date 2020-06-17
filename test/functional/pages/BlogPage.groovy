package pages

import geb.Module
import geb.Page
import org.openqa.selenium.StaleElementReferenceException

class BlogPageModule extends Module {
    static content = {
        name {$('div h2')}

        blogEntryTable{$('div.blog-entry')}
        newBlogBtn{$('a.newBlog')}
        //click to blog admin panel
        gotoBlogEditBtn{$('button#gotoEditBlog')}
        editBlogPanel {$('div#editBlog h3')}
        editBlogBtn{$('a.editThisBlog')}
        deleteBlogBtn{$('a.delThisBlog')}
        editBlogPanelHeader{$('div#editProjectBlog h3',0)}
        blogImages {$('img.blog-image')}
    }

    List blogs() {
        blogEntryTable.collect{it}
    }

    List images() {
        blogImages.collect{it.attr('src')}
    }

    List blogTitles() {
        $('div.blog-entry').find('.title').collect{it.text()}
    }

    String editBlogPanelTitle(){
       editBlogPanelHeader? editBlogPanelHeader.text() : ''
    }
}



class ProjectBlogPage extends Page {
    static url = 'project/index/project_1'

    static at = { waitFor {name != null } }

    static content = {
        name {$('div h2')}
        blogModule  { module BlogPageModule}
        overviewBtn{$('a#overview-tab', 0)}
        editProjectBlogPane{$('div#editProjectBlog')}
    }
}

class ProgramBlogPage extends Page {
    static url = 'rlp/index/test_program'
    static at = { waitFor {name != null } }

    static content = {
        name {$('div h2')}
        blogModule  { module BlogPageModule}
        adminTabPane {$('div#admin')}
        editProgramBlogTab{$('a#editProgramBlog-tab')}
        editProgramButton(required:false) { $('a.editBtnAction')}
    }

//    def editProgramBlogTab() {
//        def epbTabs
//        try {
//            epbTabs = $('a#editProgramBlog-tab')
//        }
//        catch (StaleElementReferenceException e) {}
//       epbTabs
//    }
}



class NewBlogEntryPage extends Page {

    static at = {waitFor {loaded != null } }

    static content = {
        loaded {$('button#save')}
        blogDetails { module BlogDetails }
        cancelBtn {$('button#cancel')}
        saveBtn {$('button#save')}
    }

    def submit() {
        blogDetails.saveButton.click()
    }
}

class BlogDetails extends Module {
    static content = {
        //site { $('[data-bind~=value:siteId]') }
        title { $('input#title') }
        description { $('textarea#blog-content') }
        saveButton() {
            $("button#save")
        }

        docOptions {$('select[name=docCategory] option', 2)}

        docSelect {$('select[name=docCategory]')}

        uploadingFile {$('input#image[name=files]', 0)}
        privacy(required:false) {$('input#declaration')  }
        saveBtn {$('button.btn[name=uploadingDocument]')}
    }
}

class NewProgramBlogPage extends Page{
    static url = 'blog/create?programId=test_program'

    static at = {waitFor {blogDetails.loaded != null } }
    static content = {
        blogDetails {module NewBlogModule}
    }
}

class EditSiteBlogPage extends Page {
    static url = 'admin/editSiteBlog'

    static at = {waitFor {title() != null } }

    static content={
        newBlogBtn{$('button#new')}
        editBtn{$('a.editThisBlog')}
        delBtn{$('a.delThisBlog')}
        blogDivs{$('div#site-blog')}
    }

    def blogs(){
       def lis = blogDivs.find('li')
       lis? lis: []
    }

    def title(){
       $('div h3',0)?$('div h3',0).text() : null
    }

}


class NewBlogModule extends Module {

    static content = {
        loaded {$('button#save')}
        title { $('input#title') }
        description { $('textarea#blog-content') }
        saveButton {$("button#save")}
        cancelBtn {$('button#cancel')}
    }

    def submit() {
        saveButton.click()
    }
}


