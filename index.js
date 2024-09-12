import { TypeWords } from './typer.js'; 

let target = document.getElementsByClassName("generated")[0]; 
let resetBtn = document.getElementById("reset"); 
let pauseBtn = document.getElementById("pause"); 
let playBtn = document.getElementById("resume"); 

const typingEffect = TypeWords([{text: "Hello", color: "#000000"}, {text: "Everybody", color: "#de6840"}], target, 150, 75, 500, 0, "play"); 

resetBtn.addEventListener('click', () => { typingEffect.reset(); });
pauseBtn.addEventListener('click', () => { typingEffect.pause(); });
playBtn.addEventListener('click', () => { typingEffect.resume(); });