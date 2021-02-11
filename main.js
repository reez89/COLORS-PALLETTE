// Variabili globali e selezioni
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;
/* Event Listeners */
sliders.forEach(slider=>{
    slider.addEventListener('input',hslControls);
})

colorDivs.forEach((slider,index)=>{
    slider.addEventListener('change', ()=>{
        updateTextHex(index);
    });
});

/* Funzioni */

// questa funzione ci fa genereare un colore random con vanilla javascript

// function generateHex() {  
//     const letters ='#0123456789ABCDEF';
//     let hash = '#';
//     for(let i=0; i<6;i++){
//         hash += letters[Math.floor(Math.random() * 16)];
//     }
//     return hash;
// }

// ora utilizzerò chroma.js

function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors(){
    initialColors = [];
    colorDivs.forEach((div,index)=>{
        const hexText = div.children[0];
        const randomColor = generateHex();
        // pusho il colore nell'array iniziale
        initialColors.push(chroma(randomColor).hex());
        // aggiungo il randomColor al background dei miei div color, e sosituisco l'h2.
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        // verifichiamo il contrasto
        checkTextContrast(randomColor, hexText);
        //Colore iniziale sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color,hue,brightness,saturation);
    })
    // Reset inputs
    resetInputs();
}

// creo una funzione che mi cambia il colore del testo in base alla luminance dello sfondo
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = 'black';

    }else{
        text.style.color = 'white';
    }
}

function colorizeSliders(color,hue,brightness,saturation) {
    // Scala bright
    const bright = color.set('hsl.l',0.5); // uso direttamente la metà perchè so che la parte sinistra sarà piu chiara e la destra piu scura.
    const scaleBright = chroma.scale(['black',bright,'white']); 
    // Scala di saturazione
    const noSaturation = color.set('hsl.s',0);
    const fullSaturation = color.set('hsl.s',1);
    const scaleSaturation = chroma.scale([noSaturation,color,fullSaturation]);

    // Aggiiornamento dell'input saturation
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSaturation(0)}, ${scaleSaturation(1)})`;
    //  Aggiiornamento dell'input bright
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    // Aggiornamento dell'input Hue
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

function hslControls(e) {
    const index = 
     e.target.getAttribute('data-bright') ||
     e.target.getAttribute('data-hue')||
     e.target.getAttribute('data-sat');

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const backgroundColor = initialColors[index];
    let color = chroma(backgroundColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);

    colorDivs[index].style.backgroundColor = color;

    // Colorize inputs
    colorizeSliders(color,hue,brightness,saturation);

}   

function updateTextHex(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHext = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHext.innerText = color.hex(); 
    checkTextContrast(color, textHext);
    for (icon of icons){
        checkTextContrast(color, icon)
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider =>{
        if(slider.name === 'hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === 'brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
            
        }
        if(slider.name === 'saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue * 100) / 100;
        }
    })
}
randomColors();