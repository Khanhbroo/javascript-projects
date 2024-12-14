const $ = document.querySelector.bind(document); // Create a shortcut for selecting a single element
const $$ = document.querySelectorAll.bind(document); // Create a shortcut for selecting multiple elements

// Constructor function
function Validator(formSelector, options = {}) {

    // Helper function to get the parent element that matches a selector
    let getParent = function (element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    let formRules = {}; // Object to store validation rules for each form input

    // Define validation rules
    let validatorRules = {
        required(value) {
            return value ? undefined : "Please enter this field";
        },
        email(value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "This field must be an email";
        },
        min(min) {
            return function (value) {
                const hasUppercase = /[A-Z]/;
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

                if (value.length < min) {
                    return `Please enter at least ${min} characters`;
                }
                if (!hasUppercase.test(value) || !hasSpecialChar.test(value)) {
                    return "Your password needs to have at least 1 special character and 1 uppercase letter";
                }
                return undefined; // Valid password
            }
        },
        max(max) {
            return function (value) {
                const hasUppercase = /[A-Z]/;
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

                if (value.length > max) {
                    return `Your password has maximum of ${max} characters`;
                }
                if (!hasUppercase.test(value) || !hasSpecialChar.test(value)) {
                    return "Your password needs to have at least 1 special character and 1 uppercase letter";
                }
                return undefined; // Valid password
            }
        },
    }

    // Assign form element based on the selector
    let formElement = $(formSelector);

    // Only handle when the form element exists in the DOM
    if (formElement) {
        const inputs = formElement.querySelectorAll("[name][rules]") // Select all inputs with validation rules
        for (let input of inputs) {
            let rules = input.getAttribute("rules").split("|"); // Split rules by '|'

            for (let rule of rules) {
                let ruleInfo;
                let isRuleHasValue = rule.includes(":"); // Check if the rule has a value associated

                if (isRuleHasValue) {
                    ruleInfo = rule.split(":"); // Split the rule into name and value
                    rule = ruleInfo[0];
                }

                let ruleFunc = validatorRules[rule]; // Get the validation function

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]); // Apply value if available
                }

                // Create a rule array function for input
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc); // Append to existing rules
                }
                else {
                    formRules[input.name] = [ruleFunc]; // Initialize new rules array
                }
            }

            // Listen to blur event to validate
            input.onblur = handleValidate;
            // Listen to input event to clear errors
            input.oninput = handleClearError;
        }

        // Function to handle validation
        function handleValidate(e) {
            let rules = formRules[e.target.name]; // Get validation rules for input
            let errorMessage;
            let formGroup = getParent(e.target, ".form-group"); // Get the parent form-group element
            let formMessage = formGroup.querySelector(".form-message"); // Get the error message element

            for(let rule of rules) {
                errorMessage = rule(e.target.value); // Apply each rule
                if(errorMessage) break; // Stop if error found
            }

            // Display error message UI when error exists
            if (errorMessage) {
                if (formGroup) {
                    if (formMessage) {
                        formMessage.textContent = errorMessage;
                        formGroup.classList.add("invalid");
                    }
                }
            }
            else {
                formMessage.textContent = "";
                formGroup.classList.remove("invalid");
            }

            return !errorMessage;
        }

        // Function to clear error message
        function handleClearError(e) {
            let formGroup = getParent(e.target, ".form-group");
            if (formGroup.classList.contains("invalid")) {
                formGroup.classList.remove("invalid");
            }
            let formMessage = formGroup.querySelector(".form-message");
            if (formMessage) {
                formMessage.textContent = "";
            }
        }
    }

    // Handle submit event
    formElement.onsubmit = function (e) {
        e.preventDefault();
        let isValid = true;
        let data = {};
        const inputs = formElement.querySelectorAll("[name][rules]")

        for (let input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
            data[input.name] = input.value; // Collect form data
        }

        if (isValid) {
            if(typeof options.onSubmit === "function") {
                console.log(data); // Log data
                return options.onSubmit(data);
            }
            formElement.submit(); // Submit the form
        }
    }
}
