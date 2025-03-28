Import necessary functions if needed (adapt paths if necessary)
import { extension_settings, getContext, loadExtensionSettings } from '../../../extensions.js'
import { saveSettingsDebounced, eventSource, event_types } from '../../../../script.js';

const extensionName = "my-send-button-injector"; // MUST match the folder name

// Function to inject the button
function injectCustomButton() {
    // 1. Find the container for the right-side buttons
    const $rightSendForm = $('#rightSendForm');
    // 2. Find the existing send button (to insert before it)
    const $sendButton = $('#send_but');

    // 3. Check if the target elements exist and the button isn't already injected
    if ($rightSendForm.length > 0 && $sendButton.length > 0 && $('#my_injected_button').length === 0) {
        console.log(`${extensionName}: Injecting custom button.`);

        // 4. Create your new button element (using jQuery)
        const $myCustomButton = $('<div>');

        // 5. Set attributes and content for your button
        $myCustomButton
            .attr('id', 'my_injected_button') // Unique ID for styling/selection
            .addClass('interactable') // Use ST's class for button styling/interaction
            .attr('title', 'My Custom Action Tooltip') // Tooltip text
            .css('cursor', 'pointer'); // Ensure it looks clickable

        // Add an icon (using Font Awesome like the others)
        const $icon = $('<i>').addClass('fa-solid fa-bolt'); // Example: lightning bolt icon
        $myCustomButton.append($icon);

        // Maybe add text (optional)
        // $myCustomButton.append('<span> MyBtn</span>');

        // 6. Add functionality (what happens when clicked)
        $myCustomButton.on('click', () => {
            console.log('My custom injected button clicked!');
            // --- Add your custom button logic here ---
            const text = $('#send_textarea').val();
            alert(`Textarea content: ${text}\nMy Button Action Executed!`);
            // Example: You could modify the text, call an API, etc.
        });

        // 7. Insert your new button *before* the original send button
        $myCustomButton.insertBefore($sendButton);

        console.log(`${extensionName}: Custom button injected successfully.`);

    } else if ($('#my_injected_button').length > 0) {
        console.log(`${extensionName}: Custom button already injected.`);
    }
    else {
        console.error(`${extensionName}: Could not find #rightSendForm or #send_but element. Injection failed.`);
    }
}

// Use jQuery(document).ready() or jQuery(async () => { ... }) to wait for the DOM
jQuery(async () => {
    console.log(`Loading extension: ${extensionName}`);

    // Inject the button initially
    injectCustomButton();

    // SillyTavern might dynamically recreate UI elements.
    // Observe changes in the send form area and re-inject if necessary.
    // A MutationObserver is a robust way to handle this.
    const targetNode = document.getElementById('form_sheld'); // Observe a parent
    if (targetNode) {
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                // Check if #rightSendForm or #send_but were added/removed or significantly changed
                // A simple check: if send_but exists but our button doesn't, try injecting again.
                if (document.getElementById('send_but') && !document.getElementById('my_injected_button')) {
                   console.log(`${extensionName}: Detected potential UI change. Re-injecting button.`);
                   injectCustomButton();
                   // Optimization: Maybe disconnect observer briefly if re-injection causes mutations
                   break; // Stop checking other mutations in this batch
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log(`${extensionName}: MutationObserver started on #form_sheld.`);
         // Remember to disconnect the observer if the plugin is unloaded:
         // window.addEventListener('beforeunload', () => observer.disconnect());
    } else {
        console.error(`${extensionName}: Could not find #form_sheld to observe mutations.`);
         // Fallback: Periodically check - less efficient
         // setInterval(injectCustomButton, 3000);
    }

    // --- Add any other initialization logic for your plugin here ---
});
