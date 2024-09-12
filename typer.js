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

function TypeWords(words = [], target = null, typeSpeed = 10, deleteSpeed = 10, pauseTime = 10, loops = 0, state = "play", bhvr = new BHVR()) {
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

    let updateTargetText = (newText, textColor) => {
        target.style.color = textColor;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            target.value = newText;
        } else {
            target.innerText = newText;
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
    bhvr.index = CheckForAcceptableValue("behavior index", bhvr.index, wordArray.length-1, "gt"); 
    bhvr.index = CheckForAcceptableValue("behavior index", bhvr.index, 0, "lt"); 
    if(bhvr.name != "forwards") bhvr.name = CheckForAcceptableValue("behavior name", bhvr.name, "none", "eq");

    let effectBhvr = new BHVR(bhvr.name, bhvr.index); 

    function performTypingAnimation(currentLoops) {
        if (currentLoops < 1 && loops !== 0) return; // Stop if loops are finished
        if (currentState === "pause") return; // Stop if paused
    
        let word = wordArray[currentWordIndex];
        let delay = isDeleting ? deleteSpeed : typeSpeed;
    
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
        performTypingAnimation(currentLoops);
    }

    // Start the animation
    performTypingAnimation(currentLoops);

    // Return pause, resume, and reset methods
    return {
        pause,
        resume,
        reset
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

export { TypeWords }; 