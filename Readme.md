# HTML5 Form Validation JS

Leverages HTML5 form validation API to style the output of error messages. This is a Vanilla JS implementation that uses the HTML Client-side Form Validation API - 
https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript

<br>

**Table of contents** 
- [Installation](#installation)
- Examples 
    - [Basic Usage](#basic-usage) 
    - [Grouping and Displaying Errors Together](#grouping-and-displaying-error-messages-together)
    - [Custom Error Messages](#custom-error-messages)
    - [Handling Form Submission on Success](#handling-form-submission-on-success)
    - [Prevent Plugin from Handling a Form](#prevent-plugin-from-handling-a-form)
    - [(Optional) HoneyPot Pattern](#optional-honeypot-pattern)
- [Public Methods](#public-methods)
    - FormValidation - Class
        - .registerForm()
        - .registerCallback()
- [Form Attributes](#form-attributes)

<br>

---

## Installation {#installation} 

<br>

You can use NPM to download package into your project 
```
npm install html5-form-validation-js
```
OR you can use the **html5-form-validation.js** directly in your project 

```HTML
<script src="html5-form-validation.js"></script>
```

<br>

## Basic Usage {#basic-usage}
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/html5-form-validation-js/tree/main/demo) in repo for complete example

<br>

**Instructions** 
1. Once **initFormValidation()** runs, it will try to register every form on the page unless the 'novalidate' attribute is included on the form tag. See heading *'Prevent Plugin from Handling Form'*.
2. Forms handled by the plugin should include the following HTML attributes or a warning will be logged to the console.
    - **id** - Standard HTML unique identifier
    - **data-form-callback** - Name of function to handle form submission when all inputs are valid
3. Use **FormValidation.registerCallback** to associate a named or anonymous function that will handle form submission. 
    - The first argument, **name**, should be the same as the **data-form-callback** attribute on the form.
    - The second argument, **callback**, is a function that accepts the same *event* object passed to eventListeners. 
    - Note: using **event.target.elements** you can gain access to the form elements (inputs) and subsequently their values
4. If any errors occur within the form, errors will be displayed in a **div** below the form element with a default CSS class of **.validation-message**
5. Additionally, when an error occurs the **.input-error** class is added to the input.
6. The error messages and .input-error classes will be removed once errors are corrected and the form is resubmitted.

**CSS**
```HTML
<style>
    input:invalid {
    border: 2px dashed red;
    }

    input:invalid:required {
    background-image: linear-gradient(to right, pink, lightgreen);
    }

    input:valid {
    border: 2px solid black;
    }
</style>
```

**HTML**
```HTML
<form id="myform" data-form-callback="handleFormSubmission">

    <input pattern="[a-z]{1,15}" placeholder="Lowercase only">
    <button>Submit</button>

</form>
```

**JavaScript**
```Javascript
<script type="module">

    // ES6 Module Import
    import { FormValidation, initFormValidation } from '/html5-form-validation-js/html5-form-validation.js';

    // Initialize Plugin
    initFormValidation();

    // Form Submission Handler
    FormValidation.registerCallback( 'handleFormValidation', formSubmitEvent => alert( 'Form ID - ' + formSubmitEvent.target.id + ' is valid!' ) ); 
    
</script>
```

<br>

## Grouping and Displaying Error Messages Together {#grouping-and-displaying-error-message-together}
See [*'/demo/grouped-error-messages.html'*](https://github.com/jvuzzell/html5-form-validation-js/tree/main/demo) in repo for complete example

<br>
By default the HTML5-Form-Validation-JS plugin will append a **div** with the class **.validation-message** after the input where the error occurred. Additionally, the plugin will add the **.input-error** class to the input 

**HTML**
```HTML
// Inline Input error
<input pattern="[a-z]{1,15}" placeholder="Lowercase only" class="input-error">
<div class="validation-message">Please fill out this field.</div>
```

Alternatively, developers can choose to group the error messages and display them anywhere in the document by adding the **data-error-output-id=""** attribute to the **form** tag. The value of the attribute refers to the id attribute of a div anywhere in the document. The plugin will append **div** with the class **.validation-message** for each input error detected. 

If a UI specifies multiple forms, each form can use its own grouped error message container.

**HTML**
```HTML
<div id="grouped-error-messages"></div>

<form id="myForm"  data-error-output-id="grouped-error-messages">
    ...
</form>

// A second form with independently grouped error messages
<div id="another-grouped-error-messages"></div>

<form id="myForm"  data-error-output-id="another-grouped-error-messages">
    ...
</form>
```

**Note:** When using grouped error messages, the plugin will try to normalize and display an input's **name** attribute to help the user identify where the input error occurred. 

```HTML
<input name="first-name"> // Outputs: 'First Name - Please fill out this field.
<input name="first_name"> // Outputs: 'First Name - Please fill out this field.
<input name="firstName">  // Outputs: 'FirstName - Please fill out this field.

<input name="first_name" data-error-message="My custom error message"/> 
// Outputs: 'First Name - My custom error message
```

<br>

## Custom Error Messages {#custom-error-messages}
See [*'/demo/grouped-error-messages.html'*](https://github.com/jvuzzell/html5-form-validation-js/tree/main/demo) in this repo for complete example

<br>
By default the HTML5-Form-Validation-JS plugin uses the default error message described here.https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#built-in_form_validation_examples. 

To display custom error messages, developers can add the **data-error-message** attribute to an input to override the default message.

**HTML**
```HTML
<input data-error-message="My custom error message"/>

```

<br>

## Handling Form Submission on Success {#handling-form-submission-on-success}
<br>
When the submit button is clicked on a form where the HTML5-Form-Validation-JS plugin will handle validation, **preventdefault()**, **stopImmediatePropagation()**, and **stopPropagation()** methods are called when the **submit** event is triggered on the form. As a result, the default form action will not be called; the developer has to handle form submission. 

Developers can handle form submission by registering a callback (form submission handler) via the **.registerCallback( name, eventHandler )** method. It accepts a string as its first argument and a function as its second. When the eventHandler is called, it is passed the form submit event. The *eventHandler* can be a named, anonymous, or arrow function. 

The HTML5-Form-Validation-JS plugin can register multiple callbacks by storing them in a private named array (object) within the **FormValidation.callbacks**. At present, there a getter function for retrieving callbacks has not been implemented.

**Important:** 
1. The form attribute, **data-form-callback**, and the **name** argument passed to **.registerCallback( name, eventHandler )** must be the same for the callback to be applied. 
2. The same callback can be used for multiple forms.


**HTML**
```HTML
<form id="myform" data-form-callback="handleFormSubmission">

    <input pattern="[a-z]{1,15}" placeholder="Lowercase only">
    <button>Submit</button>

</form>
```

**JavaScript**
``` Javascript
FormValidation.registerCallback( 
    'handleFormValidation', 
    function( formSubmitEvent ) { 
        alert( 'Form ID - ' + formSubmitEvent.target.id + ' is valid!' )
        formSubmitEvent.target.submit()
    }
); 
```

<br>

## Prevent Plugin from Handling a Form {#prevent-plugin-from-handling-a-form}

<br>
The HTML5-Form-Validation-JS plugin will not discriminate between forms it will try to validate. Once **initFormValidation()** runs, it will try to register every form on the page. 

To prevent the default form handling on a single form, add the **novalidate** attribute to the form tag.

**Note:** If novalidate is detected, the developer will have to handle both the form submission and validation processes. The browser's default implementation of the HTML Client-side Form Validation API will be deactivated. 
<br>
https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript
<br>

**HTML**

```HTML
<form id="myform" novalidate>

    <input pattern="[a-z]{1,15}" placeholder="Lowercase only">
    <button>Submit</button>

</form>
```

<Br>

## (Optional) Honeypot Pattern {#optional-honeypot-pattern}
See [*/demo/basic-usage.html*](https://github.com/jvuzzell/html5-form-validation-js/tree/main/demo) in this repo

<br>

Optionally, developers can implement a simple form pattern known as the Honeypot to prevent bots from spamming your form and triggering resulting emails hooks, or API. 

The pattern involves a hidden form input that users are unaware of and unlikely to fill out. The input is hidden using CSS positioning instead of display:none so as not to alert the bot, so it provides and input. On the form submit event JavaScript is used to detect whether the hidden input was left blank before performing any form actions. If the input has a value the form action is aborted. 

HTML5-Form-Validation-JS implements the concept by validating text input within a div called .jar. In future releases, the class name will be at the descretion of the developer to improve the effectiveness of the implementation. Furthermore, developers can implement their own honeypot in their form submission eventHandler. 

This technique is easy to implement and easy to counter. Recaptcha is more effective. 

**HTML**
```HTML
<style>
// Hides Honeypot from user but not bot
.jar {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    z-index: -1;
}
</style>

<div class="jar">
    <input type="text"> // If value is not blank, then form will not be submitted
</div>
```

<br>

---

## Public Methods {#public-methods}
<br>

| Method | Description |
|--------|-------------|
| initFormValidation() | Imported method that will cause the HTML5-Form-Validation-JS plugin to handle every validation  and submission events for every form without the novalidate attribute in the document. |
| FormValidation.registerForm( **formElement** ) | Takes a form element, attaches a new submit eventlistener |
| FormValidation.registerCallback( name, eventHandler ) | Stores a function in a named array within the FormValidation object to be called with the form submit event |

<br>

---

## Form Attributes {#form-attributes}

| HTML Element | Attribute | Description |
|--------------|-----------|-------------|
| Form         | id        | Native HTML unique identifier |
| | data-form-callback | Expected value: string. Should be the name used with FormValidation.registerCallback() to associate an eventHandler with the form submit event if all form inputs are valid
| | data-error-output-id | Expected value: string equal to ID of an HTML Element. Specifies a container to output grouped error messages |
| | data-near-input | Expected value: 'before' or 'after'. Determines whether inline error message is displayed before or after the form input element.
| Input | data-error-message | Expected value: string. Custom error message to display when the specified input is invalid |