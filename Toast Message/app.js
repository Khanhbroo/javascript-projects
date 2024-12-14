// Function to create and display a toast notification
function toast({
    title = "",              // Title of the toast (default: empty string)
    message = "",            // Message content of the toast (default: empty string)
    type = "info",           // Type of toast (e.g., "success", "info", "warning", "error") (default: "info")
    duration = 3000          // Duration for the toast to be visible in milliseconds (default: 3000ms)
}) {
    const main = document.querySelector("#toast"); // Get the toast container element
    if (main) {
        const toast = document.createElement("div"); // Create a new div for the toast
        
        // Automatically remove the toast after the specified duration + animation delay
        const autoRemoveId = setTimeout(function() {
            main.removeChild(toast); // Remove the toast from the DOM
        }, duration + 1300); // Add 1.3 seconds for fade-out animation
        
        // Remove the toast when the close button is clicked
        toast.onclick = function(e) {
            if (e.target.closest(".toast__close")) { // Check if the clicked element is the close button
                main.removeChild(toast); // Remove the toast from the DOM
                clearTimeout(autoRemoveId);
            }
        };

        // Icon mapping based on toast type
        const icons = {
            success: "fas fa-check-circle",     // Icon for success toast
            info: "fas fa-info-circle",         // Icon for info toast
            warning: "fas fa-exclamation-circle", // Icon for warning toast
            error: "fas fa-exclamation-circle"  // Icon for error toast
        };

        const icon = icons[type]; // Select the appropriate icon based on the type
        const delay = (duration / 1000).toFixed(2); // Convert duration to seconds for CSS animation delay

        // Add necessary classes for styling and animation
        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`; // Entry and exit animations

        // HTML structure for the toast
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i> <!-- Dynamic icon based on toast type -->
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3> <!-- Display the title -->
                <p class="toast__msg">${message}</p> <!-- Display the message -->
            </div>
            <div class="toast__close">
                <i class="fas fa-times-circle"></i> <!-- Close button -->
            </div>
        `;

        main.appendChild(toast); // Append the toast to the container
    }
}

// Function to show a success toast
function showSuccessToast() {
    toast({
        title: "Thành công!", // Title for success
        message: "Bạn dã đăng ký thành công tài khoản.", // Message for success
        type: "success", // Type of the toast (success)
        duration: 5000 // Visible for 5 seconds
    });
}

// Function to show an error toast
function showErrorToast() {
    toast({
        title: "Thất bại!", // Title for error
        message: "Có lỗi xảy ra, vui lòng liên hệ quản trị viên.", // Message for error
        type: "error", // Type of the toast (error)
        duration: 5000 // Visible for 5 seconds
    });
}
