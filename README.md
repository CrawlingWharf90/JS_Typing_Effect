# Documentation

NPM crawling-typer is a js node package made to easily implement the stylish effect of typing an array of words one character at the time.<br>
Quickly customize settings such as typing speed, delete speed, pause time between one word and the next, number of times the effect should loop and effect behavior after said number (if finite) of loops has concluded. <br>

## Index

1. <a href="#add-crawling-typer-to-your-project">Add crawling-typer to your project</a>  
2. <a href="#type-words-function">Type Words Function</a>  
3. <a href="#secondary-functions">Secondary Functions</a>  
   i. <a href="#pause-effect">Pause Effect</a>  
   ii. <a href="#resume-effect">Resume Effect</a>  
   iii. <a href="#reset-effect">Reset Effect</a>  
   iv. <a href="#set-cursor">Set Cursor</a>  
4. <a href="#examples">Examples</a>

<h3 id="crawling-typer-section">Add crawling-typer to your project</h3>

To use crawling typer in your project just import the npm package in the JavaScript File you want to use the effect in by adding the following import statement at the top of your page: 

```JS
import TypeWords from 'https://cdn.jsdelivr.net/npm/crawling-typer@1.1.0/typer.js';
```

<h3 id="type-words-function">Type Words Function</h3>

```JS
function TypeWords(words, target, typeSpeed, deleteSpeed, pauseTime, loops, state, bhvr)
```

Words $\rightarrow$ is the array of words that you want to display, each word has to paramaters:<br>

    text: is the string that you want to type
    color: the color of the this string

Target $\rightarrow$ is the target element where the words should be typed

Type Speed $\rightarrow$ is the time in miliseconds (ms) that should be waited after a char is displayed until the next one is typed

> By default its' value is set to 250ms

Delete Speed $\rightarrow$ is the time in miliseconds (ms) that should be waited after a char is removed until the next one is deleted

> By default its' value is set to 75ms

Pause Time $\rightarrow$ is the time in miliseconds (ms) that should be waited after a word has been fully typed to when it starts getting deleted, also used for the time since a word has been fully deleted to when the next one starts being typed

> By default its' value is set to 1000ms

Loops $\rightarrow$ The number of times the array should loop before the effect stops, if this number is set to 0 then the effect will loop endlessly

> By default its' value is set to 0

State $\rightarrow$ The starting state of the effect, this paramater takes only two values:
<p style="margin-left:40px">
    <b>
        Play: <i>The effect will start with the typing animation running</i>
    </b>
    <br><br>
    <b>
        Pause: <i>The effect will start without the typing animation running</i> {The animation will need to be started by using the <a href="Resume Effect">Resume</a> or <a href="Reset Effect">Reset</a> functions}
    </b>
</p>

> By default its' value is set to play

BHVR (Behaviour) $\rightarrow$ This defines how the effect should behave after the effect has looped a finite amount of times.It takes two paramagters: 

    Name: name of the behaviour case that should be applied.
          Name takes the following values: 
    
<p style="margin-left:40px">
    <b>
        None: <i>Nothing will happen the effect will just stop playing leaving the target blank</i>
    </b>
    <br><br>
    <b>
        Forwards: <i>The effect will stop on the word with the given index on the last loop</i>
    </b>
</p>

> By default its' value is set to none


    Index: Index of the word at which the chosen behaviour should be applied

> By default its' value is set to 0


<h2 id="secondary-functions">Secondary Functions</h2>

<h3 id="pause-effect">Pause Effect</h3>
    
```JS
    TypeWords.pause();
```

    Pauses the effect at the current typed/deleted character

<h3 id="resume-effect">Resume Effect</h3>

```JS
    TypeWords.resume(); 
```

    Resumes the effect at the current typed/deleted character

<h3 id="reset-effect">Reset Effect</h3>

```JS
    TypeWords.reset(); 
```

    Restarts the effect from the start

> NOTE: The effect can be reset only if the effect is paused

<h3 id="set-cursor">Set Cursor</h3>

```JS
    TypeWords.cursor(visible, blinkSpeed, symbol)
```

    Adds a cursor to the head of the typed word.
    Takes the following parameters:

Visible $\rightarrow$ makes the cursor visible, it takes only takes two values: 
<p style="margin-left:40px">
    <b>
        False: <i>The cursor will not be shown</i>
    </b>
    <br><br>
    <b>
        True: <i>The cursor will be shown</i>
    </b>
</p>

> By default its' value is set to false

Blink Speed $\rightarrow$ sets the speed at which the cursor should be blink, if it's set to 0 the cursor will remain still and not blink

> NOTE: It is worth noteing that every time a character is typed this timer resets

> By default its' value is set to 0

Symbol $\rightarrow$ sets the symbol that should be used as a cursor icon

> By default this is set to an underscore ("_")


<h2 id="examples">Examples</h2>

#### EX 1

***This creates a basic typing effect cycling endlessly between the words "Hello" and "Everybody" using default values and adding a cursor to the effect***

**HTML**
```HTML
<body>
    <p>(✿◠‿◠) <span class="generated"></span></p>
    
    <script type="module" src="index.js"></script>
</body>
```

**JAVA SCRIPT**

```JS
import TypeWords from 'https://cdn.jsdelivr.net/npm/crawling-typer@1.1.1/typer.js';

console.log("TypeWords: ", TypeWords);

let target = document.getElementsByClassName("generated")[0]; 

const typingEffect = TypeWords([{text:"Hello", color:"#000000"}, {text:"Everybody", color:"#CA8311FF"}], target);

typingEffect.cursor(true); 
```

#### EX 2

***This plays the childish game "She Loves Me, She Loves Me Not" by looping the words a random amount of times and stopping on one of the two random outcomes. Starts the effect in the pause state, so the user needs to start it by clicking the resume of reset buttons, adds a pause button so he can pause the effect and removes the cursor, adds custom typeSpeed, deleteSpeed and pauseTime between words***

**HTML**
```HTML
<body>
    <p>(✿◠‿◠) <span class="generated"></span></p>

    <div>
        <span><button id="pause" class="def-btn">Pause</button></span>
        <span><button id="resume" class="def-btn">Resume</button></span>
        <span><button id="reset" class="def-btn">Reset</button></span>
    </div>
    
    <script type="module" src="index.js"></script>
</body>
```

**JAVA SCRIPT**

```JS
import TypeWords from 'https://cdn.jsdelivr.net/npm/crawling-typer@1.1.1/typer.js';

const numberOfLoops = Math.floor(Math.random() * 10) + 1;
const randIndex = Math.floor(Math.random() * 2);

console.info(`number of loops ${numberOfLoops}\nrandom index ${randIndex}`);

let target = document.getElementsByClassName("generated")[0]; 
let resetBtn = document.getElementById("reset"); 
let pauseBtn = document.getElementById("pause"); 
let playBtn = document.getElementById("resume"); 

const typingEffect = TypeWords([{text:"She Loves Me", color:"#319507FF"}, {text:"She Loves Me Not", color:"#A91818FF"}], target, 150, 100, 1500, numberOfLoops, "pause", {name:"forwards", index: randIndex});


resetBtn.addEventListener('click', () => { typingEffect.reset(); });
pauseBtn.addEventListener('click', () => { typingEffect.pause(); });
playBtn.addEventListener('click', () => { typingEffect.resume(); }); 
```