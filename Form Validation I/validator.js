// Using bind function for fast assigning shorthand
const $ = document.querySelector.bind(document); // Shortcut for selecting a single DOM element
const $$ = document.querySelectorAll.bind(document); // Shortcut for selecting multiple DOM elements

// Validator constructor function
function Validator(options) {
    // Select the form element based on the provided selector
    var formElement = $(options.form);

    // Helper function to find the parent element of an input field
    var getParent = function (element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement; // Return the matched parent element
            }
            element = element.parentElement;
        }
    };

    // Object to store validation rules for each input field
    var selectorRules = {};

    // Function to validate a specific input field based on rules
    function validate(inputElement, rule) {
        var parentElement = getParent(inputElement, options.formGroupSelector); // Find the parent form group
        var errorElement = parentElement.querySelector(options.errorSelector); // Get the error message element
        var errorMessage;

        // Retrieve all rules for the input field
        var rules = selectorRules[rule.selector];

        // Iterate through the rules and stop if an error is found
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value); // Validate the input value
            if (errorMessage) break; // Stop if an error is found
        }

        // Display or clear error messages based on validation results
        if (errorMessage) {
            errorElement.innerText = errorMessage; // Display the error message
            parentElement.classList.add("invalid"); // Add 'invalid' class for styling
        } else {
            errorElement.innerText = ""; // Clear any existing error messages
            parentElement.classList.remove("invalid"); // Remove 'invalid' class
        }
        return !errorMessage; // Return true if valid, false otherwise
    }

    // If the form element exists
    if (formElement) {
        // Iterate through all rules defined in options
        options.rules.forEach(function (rule) {
            // Store rules for each input field
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test); // Add multiple rules for the same field
            } else {
                selectorRules[rule.selector] = [rule.test]; // Initialize rules for the field
            }

            // Get the input element based on the rule's selector
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // Validate input field on blur event
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // Clear error messages on user input
                inputElement.oninput = function () {
                    var parentElement = getParent(inputElement, options.formGroupSelector);
                    var errorElement = parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = ""; // Clear error message
                    parentElement.classList.remove("invalid"); // Remove 'invalid' class
                };
            }
        });

        // Handle form submission
        formElement.onsubmit = function (e) {
            e.preventDefault(); // Prevent the default form submission
            var isFormValid = true; // Track overall form validity

            // Validate each field when the form is submitted
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule); // Validate input field
                if (!isValid) {
                    isFormValid = false; // Mark form as invalid if any field fails
                }
            });

            // If the form is valid, process the form submission
            if (isFormValid) {
                if (typeof options.onSubmit === "function") {
                    var enableInputs = formElement.querySelectorAll("[name]:not([disable])");
                    // Collect form values into an object
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value; // Add input name and value to the object

                        // Handle file inputs separately
                        if (input.type === "file") {
                            values[input.name] = input.files; // Add file list to the object
                        }
                        return values; // Return the updated values object
                    }, {});

                    options.onSubmit(formValues); // Call the custom onSubmit handler
                } else {
                    formElement.submit(); // Submit the form traditionally
                }
            }
        };
    }
}

// Validation rule: Check if the field is required
Validator.isRequired = function (selector) {
    return {
        selector,
        test(value) {
            return value.trim() ? undefined : "Please enter this field"; // Check if the value is non-empty
        }
    };
};

// Validation rule: Check if the field contains a valid email address
Validator.isEmail = function (selector) {
    return {
        selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Regex for email validation
            return regex.test(value) ? undefined : "This field must be an email"; // Validate using regex
        }
    };
};

// Validation rule: Check if the field meets minimum length and complexity
Validator.minLength = function (selector, min) {
    return {
        selector,
        test(value) {
            const hasUppercase = /[A-Z]/; // Check for uppercase letters
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Check for special characters

            if (value.length <= min) {
                return `Please enter at least ${min} characters`; // Error for insufficient length
            }
            if (!hasUppercase.test(value) || !hasSpecialChar.test(value)) {
                return "Your password needs to have at least 1 special character and 1 uppercase letter"; // Error for missing complexity
            }
            return undefined; // Return undefined if valid
        }
    };
};

// Validation rule: Confirm that two fields match (e.g., password confirmation)
Validator.isConfirmed = function (selector, getConfirmValue, errorMessage) {
    return {
        selector,
        test(value) {
            return value === getConfirmValue() ? undefined : errorMessage || "Input data not correct"; // Check if values match
        }
    };
};
