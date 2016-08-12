<tr class="title-row">
    <td colspan="4">${title}</td>
</tr>
<g:each in="${questions}" var="question" status="i">
<tr>
    <g:if test="${i == 0}">
        <td class="gutter" rowspan="${questions.size()}"></td>
    </g:if>
    <td class="question">${question.text}</td>
    <td class="meets-expectations">
        <select data-validation-engine="validate[required]" data-bind="value:meetsExpectation${question.name}, options:${fc.modelAsJavascript(model: question.constraints)}"></select>
    </td>
    <td class="evidence">
        <textarea maxlength="2000" data-validation-engine="validate[required,maxSize[2000]]" data-bind="textInput:evidenceFor${question.name}" data-prompt-position="topRight:-110"></textarea>
    </td>
</tr>
</g:each>
<tr>
    <td>Additional practices</td>
    <td>${additionalPracticeQuestion.text}</td>
    <td>
        <select data-validation-engine="validate[required]" data-bind="value:meetsExpectation${additionalPracticeQuestion.name}, options:${fc.modelAsJavascript(model: additionalPracticeQuestion.constraints)}"></select>
    </td>
    <td>
        <textarea maxlength="2000" data-validation-engine="validate[required,maxSize[2000]]" data-bind="value:evidenceFor${additionalPracticeQuestion.name}" data-prompt-position="topRight:-110"></textarea>
    </td>
</tr>
