export let FormValidation = ( function( window, document ) {

    let callbacks = [];
    let validationMsgClass = 'validation-message';
    let inputErrorClass = 'input-error';

    function init( formElement ) {

        let formId = formElement.id;
        let validFormCallback = formElement.getAttribute( 'data-form-callback' );

        if( formId === undefined ) {
            console.warn( 'HTML5 Validation Plugin, Form ID missing.' );
            return; // exit plugin
        }

        if( validFormCallback === null ) {
            console.warn( 'HTML5 Validation Plugin, name of callback not supplied. Form ID: ' + formId );
            return; // exit plugin
        }

        formElement.noValidate = true; 
        formElement.addEventListener( 'submit', function( submitEvent ) {
            submitEvent.preventDefault();
            submitEvent.stopImmediatePropagation();
            submitEvent.stopPropagation();
            validateForm( submitEvent, validFormCallback );
        });

    }

    /**
     * Check for form submissions by bots
     * @param {Node} honeypot The function to call after form is validated 
     */

    let checkHoneypot = function( form ) {
        
        var honeypot = form.querySelector( '.jar input[type="text"]' );
        if( honeypot === null ) {
            return; // Skip this
        } else {
            return ( honeypot.value !== '' ) ? true : false;
        }

    } 

    /** 
     * Validate form 
     * 
     * @param {Object} submitEvent  Event listener triggered on click of submit button
     * @param {String} callbackName Name of index where callback function was stored within this.forms
     */

    function validateForm( submitEvent, callbackName ) {

        // Prevent form submissions by bots 
        if ( checkHoneypot( submitEvent.target ) ) { return false };

        // Check field validity
        if ( !submitEvent.target.checkValidity() ) {

            removeMessage( submitEvent.target );
            postMessage( submitEvent.target );

        } else {
            
            removeMessage( submitEvent.target );
            callbacks[ callbackName ]( submitEvent );
            return true; /* everything's cool, the form is valid! */

        }

    }

    /**
     * Add validation messages to form inputs 
     * 
     * @param {HTMLelement} form 
     */

    function postMessage( form ) {

        let elements = form.elements;
        let errorOutputId = form.getAttribute( 'data-error-output-id' ); 
        let aroundInput = form.getAttribute( 'data-near-input' );
        let errorMsgContainer = document.getElementById( errorOutputId );

        /* Loop through the elements, looking for an invalid one. */
        for ( let index = 0, len = elements.length; index < len; index++ ) {

            let element = elements[ index ];
            let message = element.validationMessage;
            let parent  = element.parentNode; 

            if( element.dataset.errorMessage !== undefined ) { 
                message = element.dataset.errorMessage; 
            } 

            if( errorOutputId !== null ) {
                message = formatElementName( element.name ) + " - " + message;
            }
               
            if ( element.willValidate === true && element.validity.valid !== true ) {
                
                let messageDiv = document.createElement( 'div' );
                messageDiv.classList.add( validationMsgClass );
                messageDiv.appendChild( document.createTextNode( message ) );

                element.classList.add( inputErrorClass );
                if( errorOutputId === null ) {
                    
                    if( aroundInput === 'before' ) { 
                        parent.insertBefore( messageDiv, element.previousSibling );
                    } else { 
                        parent.insertBefore( messageDiv, element.nextSibling );
                    }
                                        
                } else {
                    errorMsgContainer.appendChild( messageDiv );
                }

            }

        }

        function formatElementName( name ) { 
            let newName = name.replace( '-', ' ' ).replace( '_', ' ' );
            return newName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }

    }

    /**
     * Remove validation messages from form 
     * 
     * @param {HTMLelement} form 
     */

    function removeMessage( form ) {

        let validationMessages = form.querySelectorAll( '.' + validationMsgClass );
        for( let i = 0; i < validationMessages.length; i++ ) {
            validationMessages[ i ].remove();
        }

        let inputErrors = form.querySelectorAll( '.' + inputErrorClass );
        for( let i = 0; i < inputErrors.length; i++ ) {
            inputErrors[ i ].classList.remove( inputErrorClass );
        }

    }

    function registerCallback( callbackName, func  ) {

        callbacks[ callbackName ] = func;

    }

    return {
        registerForm : init, 
        removeMessage : removeMessage, 
        postMessage : postMessage, 
        registerCallback: registerCallback
    }

})( window, document );

export const initFormValidation = function() {

    let formsOnPage = document.querySelectorAll( 'form' );

    for( let i = 0; i < formsOnPage.length; i++  ) {
        if( formsOnPage[ i ].hasAttribute( 'novalidate' ) ) { continue; }
        FormValidation.registerForm( formsOnPage[ i ] );
    }

}