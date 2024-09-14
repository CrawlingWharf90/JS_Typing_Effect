/****************************************************************************************
   ______                    ___            _       ____               ________  ____ 
  / ____/________ __      __/ (_)___  ____ | |     / / /_  ____ ______/ __/ __ \/ __ \
 / /   / ___/ __ `/ | /| / / / / __ \/ __ `/ | /| / / __ \/ __ `/ ___/ /_/ /_/ / / / /
/ /___/ /  / /_/ /| |/ |/ / / / / / / /_/ /| |/ |/ / / / / /_/ / /  / __/\__, / /_/ / 
\____/_/   \__,_/ |__/|__/_/_/_/ /_/\__, / |__/|__/_/ /_/\__,_/_/  /_/  /____/\____/  
                                   /____/                                             
 ***************************************************************************************/

class Word 
{
    constructor(text, color) 
    {
        this.text = text;
        this.color = color || "black";
    }
}

class BHVR
{
    constructor(name = "none", index = 0)
    {
        this.name = name || "none"; 
        this.index = index; 
    }
}

function TypeWords(words = [], target = null, typeSpeed = 250, deleteSpeed = 75, pauseTime = 1000, loops = 0, state = "play", bhvr = new BHVR()) {
    if (target == null) {
        console.error("No target assigned to TypeWords function");
        return;
    }

    let currentState = state;
    let isPaused = (state === "pause");
    let pauseTimeouts = [];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false; // To track if we're in the delete phase
    let remainingTime = 0; // To track time left for the next action
    let currentLoops = loops;
    let lastTypedTimestamp = 0; // To track when the last character was typed or deleted

    // Default cursor settings
    let cursorVisible = false;
    let cursorSymbol = '';
    let cursorBlinkInterval = null;
    let cursorBlinkSpeed = 500; // Default blink speed in ms

    // Update the target text with or without the cursor symbol
    let updateTargetText = (newText, textColor) => {
        target.style.color = textColor;
        let textWithCursor = cursorVisible ? newText + cursorSymbol : newText; // Append cursor symbol if visible
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            target.value = textWithCursor;
        } else {
            target.innerText = textWithCursor;
        }
    };

    // Function to toggle cursor visibility (blinking effect)
    let blinkCursor = () => {
        // Clear the interval if it's already running
        if (cursorBlinkInterval) clearInterval(cursorBlinkInterval);

        // If blink speed is 0, don't blink the cursor, keep it visible or hidden as is
        if (cursorBlinkSpeed === 0) {
            cursorVisible = true; // Keep cursor always visible if no blink
            updateTargetText(target.innerText.slice(0, -cursorSymbol.length), target.style.color);
            return;
        }

        // Start the blink animation independent of the typing/deleting
        cursorBlinkInterval = setInterval(() => {
            cursorVisible = !cursorVisible; // Toggle cursor visibility
            updateTargetText(target.innerText.slice(0, -cursorSymbol.length), target.style.color);
        }, cursorBlinkSpeed); // Blink at intervals of cursorBlinkSpeed
    };

    // Clear the blinking interval
    let clearCursorBlink = () => {
        if (cursorBlinkInterval) {
            clearInterval(cursorBlinkInterval);
            cursorBlinkInterval = null;
        }
    };

    if (words.length === 0) {
        console.warn("The 'words' array is empty, please enter words");
        words.push(new Word("Please provide text...", "black"));
    }

    let wordArray = words.map(word => new Word(word.text, word.color));

    typeSpeed = CheckForAcceptableValue("typeSpeed", typeSpeed, 10, "lt");
    deleteSpeed = CheckForAcceptableValue("deleteSpeed", deleteSpeed, 10, "lt");
    pauseTime = CheckForAcceptableValue("pauseTime", pauseTime, 10, "lt");
    loops = CheckForAcceptableValue("loops", loops, 0, "lt");
    bhvr.index = CheckForAcceptableValue("behavior index", bhvr.index, wordArray.length - 1, "gt");
    bhvr.index = CheckForAcceptableValue("behavior index", bhvr.index, 0, "lt");
    if (bhvr.name != "forwards") bhvr.name = CheckForAcceptableValue("behavior name", bhvr.name, "none", "eq");

    let effectBhvr = new BHVR(bhvr.name, bhvr.index);

    function performTypingAnimation(currentLoops) {
        if (currentLoops < 1 && loops !== 0) return; // Stop if loops are finished
        if (currentState === "pause") return; // Stop if paused

        let word = wordArray[currentWordIndex];
        let delay = isDeleting ? deleteSpeed : typeSpeed;

        // Reset the blinking cursor every time a char is typed or deleted
        cursorVisible = true; // Ensure the cursor is visible while typing/deleting
        updateTargetText(word.text.substring(0, currentCharIndex), word.color); // Ensure the cursor resets after the char update
        clearCursorBlink(); // Clear the blink timer to stop blinking
        blinkCursor(); // Restart blinking cursor, but only after typing pauses

        // Typing phase
        if (!isDeleting && currentCharIndex < word.text.length) {
            updateTargetText(word.text.substring(0, currentCharIndex + 1), word.color);
            currentCharIndex++;
            remainingTime = typeSpeed;
        }
        // Deleting phase
        else if (isDeleting && currentCharIndex > 0) {
            updateTargetText(word.text.substring(0, currentCharIndex - 1), word.color);
            currentCharIndex--;
            remainingTime = deleteSpeed;
        }
        // Finished typing, pause before deleting
        else if (!isDeleting && currentCharIndex === word.text.length) {
            // Check if it's the last loop and should not delete
            if (loops !== 0 && currentLoops === 1 && effectBhvr.name === "forwards" && currentWordIndex === effectBhvr.index) {
                // On the last loop, don't delete the word and stop
                return;
            }
            isDeleting = true;
            remainingTime = pauseTime;
        }
        // Finished deleting, move to next word
        else if (isDeleting && currentCharIndex === 0) {
            currentWordIndex++;

            // Check if it's the last loop
            if (currentWordIndex >= wordArray.length) {
                currentWordIndex = 0;
                currentLoops--;
            }

            isDeleting = false;
            remainingTime = pauseTime;
        }

        pauseTimeouts.push(setTimeout(() => {
            performTypingAnimation(currentLoops);
        }, remainingTime));
    }

    function pause() {
        currentState = "pause";
        isPaused = true;
        pauseTimeouts.forEach(timeout => clearTimeout(timeout));
        pauseTimeouts = [];
        clearCursorBlink(); // Stop cursor blinking when paused
    }

    function resume() {
        if (isPaused) {
            currentState = "play";
            isPaused = false;
            // Resume from the saved state
            performTypingAnimation(currentLoops);
        }
    }

    function reset() {
        currentState = "play";
        isPaused = false;
        currentWordIndex = 0;
        currentCharIndex = 0;
        isDeleting = false;
        remainingTime = 0;
        currentLoops = loops;
        pauseTimeouts.forEach(timeout => clearTimeout(timeout));
        pauseTimeouts = [];
        clearCursorBlink();
        performTypingAnimation(currentLoops);
    }

    function cursor(visible = false, blinkSpeed = 0, symbol = '_') {
        cursorVisible = visible;
        cursorSymbol = symbol;
        blinkSpeed = CheckForAcceptableValue("Blink Speed", blinkSpeed, 0, "lt");
        cursorBlinkSpeed = blinkSpeed;

        if (cursorVisible) {
            blinkCursor(); // Start blinking cursor independently
        } else {
            clearCursorBlink(); // Stop blinking if cursor is not visible
        }
    }

    // Start the animation
    performTypingAnimation(currentLoops);

    // Return pause, resume, reset, and cursor methods
    return {
        pause,
        resume,
        reset,
        cursor 
    };
}







function CheckForAcceptableValue(varName = "", value = null, def = null, checkType = null)
{ 
    if(value == null || def == null || checkType == null)
    {
        console.error("Please provide all data needed when checking if value is acceptable for " + varName + "\nvalue: " + value + "\ndefault value: " + def + "\ncheckType: " + checkType);
        return;
    }

    switch(checkType.toLowerCase())
    {
        case "lt": 
            if(value < def)
            {
                console.warn(varName + " cannot be less than " + def + " -> it's value was set to " + def + " by default");
                value = def; 
            }
            break; 
        case "gt": 
            if(value > def)
            {
                console.warn(varName + " cannot be greater than " + def + " -> it's value was set to " + def + " by default");
                value = def; 
            }
            break;
        case "eq":
            if(value != def)
            {
                console.warn(varName + " doesn't recognize: " + value + " -> " + varName + " was set to " + def + " by default");
                value = def; 
            }
            break;
        default:
            console.error(checkType + " is not an acceptable variable check type");
            value = null; 
            break;
    }

    return value; 
}

module.exports = TypeWords