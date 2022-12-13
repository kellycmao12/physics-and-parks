let poem;
let counter = 0;
let lineHeight = 50;
let fontSize = 40;
let spectral;
let started = false;
let introStr = "on physics and parks\n\nthis poem is about the confusing return to normal life after covid. it’s inspired by a time my friend and i went to washington square park to try to do some homework. i wrote it in late march 2021, right at the beginning of the nationwide vaccine rollout — too soon to feel normal around hundreds of strangers but too warm not to go out and celebrate. \n\nthroughout the poem, you will be given certain instructions to follow. there is also some accompanying audio, so using headphones is recommended.";
let currLines;
let gradientY;
let gradient;
let gradientSpeed = 3;
let nextArrow;
let nextArrowSize = 40;
let nextArrowX, nextArrowY;
let interacted = false; // keeps track of if user has pressed interactive feature on current screen

let textX, textY, lineWidth;
let interactiveText = ['teach me', 'blur into trampled chalk', 'reduce it all to periphery.', 'but tunnel vision can only take you so far.', 'exponential revelry', 'only in free-fall does it become clear', 'plummet into cacophonous, chaotic chroma.'];
let underlineWidth;

// audio
let parkNoise;
let breathSound;
let chalkSound;
let whiteNoise;
let whooshSound;
let splashSound;

// stanza 1 (breathe)
let pinkCircle;
let circleSize = 300;
let breatheIn, breatheOut;
let currBreatheImg;
let breatheSizeChange;
let numBreaths = 0;

// stanza 2 (chalk)
let chalk;
let chalkDust;
let chalkDusts = [];

// stanza 3 (periphery)
let greenRect;

// stanza 4 (periphery cont)
let pinkRect;

// stanza 5: volume
let volumeBar;

// stanza 6: free fall
let speed = 1;
let gravity = 0.5;

// stanza 7: 360 image
let parkImg360;

function preload() {
    // general
    poem = loadJSON("poem.json");
    spectral = loadFont('assets/Spectral/Spectral-Regular.ttf');
    gradient = loadImage('assets/white gradient.png');
    nextArrow = loadImage('assets/next arrow.png');

    // page-specific
    breatheIn = loadImage('assets/breathe in blue.png');
    breatheOut = loadImage('assets/breathe out blue.png');
    chalk = loadImage('assets/chalk.png');
    chalkDust = loadImage('assets/chalk dust.png')
    greenRect = loadImage('assets/green rect.png');
    pinkRect = loadImage('assets/pink rect.png');
    volumeBar = loadImage('assets/volume bar.png');

    // audio
    parkNoise = loadSound('assets/audio/wsp binaural.mp3');
    breathSound = loadSound('assets/audio/breath.mp3');
    chalkSound = loadSound('assets/audio/chalk.wav');
    whiteNoise = loadSound('assets/audio/white noise.wav');
    whooshSound = loadSound('assets/audio/whoosh.mp3');
    splashSound = loadSound('assets/audio/splash.wav');

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gradientY = height;
    textX = width/6;
    textY = height/6;
    lineWidth = 2 * width/3;
    nextArrowX = width - textX/2 - nextArrowSize/2;
    nextArrowY = height/2 - nextArrowSize;

    // play park noise
    parkNoise.setVolume(0.1);
    parkNoise.loop();

    chalkSound.setVolume(2);
    whiteNoise.setVolume(0.5);

    // remove perlin noise bias (towards negative)
    noiseDetail(24);

    // page 1
    currBreatheImg = breatheIn;
    breatheSizeChange = 1;
}
  
function draw() {
    background(255);
    textSize(fontSize);
    textFont(spectral);

    // draw next arrow
    if (counter <= 5) {
        imageMode(CORNER);
        image(nextArrow, nextArrowX, nextArrowY, nextArrowSize, nextArrowSize * 2);
    }

    if (!started) { // intro screen
        text(introStr, textX, textY, lineWidth);
        showInteractionHelper(-1, 34, 216, 107, 0);
    } else {    // poem pages
        currLines = poem.stanzas[counter].lines
        for (i = 0; i < currLines.length; i++) {
            text(currLines[i], textX, textY + i * lineHeight);
        }

        imageMode(CORNER);
        image(gradient, 0, gradientY, width, height);
        gradientY += gradientSpeed;

        if (gradientY > currLines.length * lineHeight) {
            showInteraction();
        }

        if (counter == 0) {
            if (interacted) {
                imageMode(CENTER);

                // control if breathe circle is getting bigger or smaller
                if (circleSize < 300) {
                    numBreaths++;
                    currBreatheImg = breatheIn;
                    breatheSizeChange = 1;
                } else if (circleSize > 475) {
                    currBreatheImg = breatheOut;
                    breatheSizeChange = -1;
                }
                
                // end after 2 breaths
                if (numBreaths >= 2) {
                    cursor(ARROW);
                } else {
                    // update and draw breathe image
                    circleSize += breatheSizeChange;
                    noCursor();
                    image(currBreatheImg, mouseX, mouseY, circleSize, circleSize);
                }

                imageMode(CORNER);
            }
        } else if (counter == 1) {
            if (interacted) {
                // add new chalk dusts when mouse is pressed
                if (mouseIsPressed) {
                    chalkDusts.push(new ChalkDust(mouseX, mouseY));
                    chalkDusts.push(new ChalkDust(mouseX + random(-200, 200), mouseY + random(-200, 200)));
                } else {
                    imageMode(CENTER);
                    image(chalkDust, mouseX, mouseY, 100, 100);
                    image(chalkDust, mouseX, mouseY, 100, 100);
                }
                // draw chalk dust where user has drawn
                for (let i = 0; i < chalkDusts.length; i++) {
                    chalkDusts[i].display();
                }
                // turn cursor into a chalk
                imageMode(CENTER);
                noCursor();
                let chalkSize = width/10;
                image(chalk, mouseX + chalkSize/3, mouseY - chalkSize/6, chalkSize, chalkSize);
                imageMode(CORNER);
                fill(0);
            }
        } else if (counter == 2) {
            if (interacted) {
                // turn cursor into green periphery image
                imageMode(CENTER);
                noCursor();
                image(greenRect, mouseX, mouseY);
                imageMode(CORNER);
                fill(0);
            }
        } else if (counter == 3) {
            if (!interacted) {
                // cursor starts as pink periphery image
                gradientY = height;
                imageMode(CENTER);
                noCursor();
                image(pinkRect, mouseX, mouseY);
                imageMode(CORNER);
                fill(0);
            } else if (interacted) {
                // turn cursor back to normal
                cursor(ARROW);
                // turn audio back to park noise
                if (whiteNoise.isPlaying()) {
                    whiteNoise.stop();
                    parkNoise.setVolume(0.1);
                }
            }
        } else if (counter == 4) {
            whiteNoise.stop();
            if (interacted) {
                // show volume bar
                parkNoise.setVolume(1);
                volumeBar.resize(lineWidth, 0);
                imageMode(CENTER);
                image(volumeBar, width/2, height - textY);

                // map mouseX to volume slider, adjust park noise volume
                push();
                stroke(255, 173, 76);
                fill(255);
                ellipseMode(CENTER);
                let volumeX = map(mouseX, 0, width, textX + 0.23 * lineWidth, textX + lineWidth);
                ellipse(volumeX, height - textY, 50, 50);
                let newVolume = map(volumeX, textX + 0.23 * lineWidth, textX + lineWidth, 0, 1);
                parkNoise.setVolume(newVolume);
                pop();
            }
        } else if (counter == 5) {
            if (interacted) {
                // make text fall
                console.log('textY:', textY);
                textY += speed;
                speed += gravity;
            }
        } else if (counter == 6) {
            // nothing needed here
        }
    }
    
}

// detect if next arrow is pressed
function detectNextPressed() {
    // check if mouse is on the next arrow
    if (mouseX >= nextArrowX && mouseX <= nextArrowX + nextArrowSize
        && mouseY >= nextArrowY && mouseY <= nextArrowY + nextArrowSize * 2) {
            // go to next page
            if (!started) {
                started = true;
                gradientY = 0;
            } else {
                // reset gradient position, interacted state, and cursor
                counter++;
                interacted = false;
                gradientY = 0;
                textY = height/6;
                cursor(ARROW);
                if (breathSound.isPlaying()) {
                    breathSound.stop();
                }
                if (chalkSound.isPlaying()) {
                    chalkSound.stop();
                }
            }
    } else {
        
    }
}

// underline interaction and control hover state before the user interacts
function showInteraction() {
    if (counter == 0) {
        showInteractionHelper(0, 101, 154, 255, 8);
    } else if (counter == 1) {
        showInteractionHelper(1, 255, 150, 213, 1);
    } else if (counter == 2) {
        showInteractionHelper(2, 34, 216, 107, 2);
    } else if (counter == 3) {
        showInteractionHelper(3, 255, 0, 122, 4);
    } else if (counter == 4) {
        showInteractionHelper(4, 255, 173, 76, 1);
    } else if (counter == 5) {
        showInteractionHelper(5, 127, 85, 215, 3);
    } else if (counter == 6) {
        showInteractionHelper(6, 255, 73, 73, 1);
    }
}

// helper function for showInteraction
function showInteractionHelper(counter, r, g, b, lineNum) {
    if (!started) { // underline title on start screen
        underlineWidth = textWidth('on physics and parks');
        fill(0);
        rect(textX, textY + lineNum * lineHeight + 10, underlineWidth, 1);
        push();
        fill(r, g, b);
        stroke(r, g, b);
        text('on physics and parks', textX, textY + lineNum * lineHeight);
        rect(textX, textY + lineNum * lineHeight + 10, underlineWidth, 1);
        pop();
    } else {
        underlineWidth = textWidth(interactiveText[counter]);
        fill(0);
        rect(textX, textY + lineNum * lineHeight + 10, underlineWidth, 1);
    
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + (lineNum-1) * lineHeight + 10 && mouseY < textY + lineNum * lineHeight + 10) {
            fill(200);
            push();
            fill(r, g, b);
            stroke(r, g, b);
            text(interactiveText[counter], textX, textY + lineNum * lineHeight);
            rect(textX, textY + lineNum * lineHeight + 10, underlineWidth, 1);
            pop();
        }
    }
    
}

// detect interactions
function mouseClicked() {
    if (interacted || !started) {
        detectNextPressed();
    }

    underlineWidth = textWidth(interactiveText[counter]);

    if (counter == 0) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 7 * lineHeight + 10 && mouseY < textY + 8 * lineHeight + 10) {
                interacted = true;
                breathSound.play();
        }
    } else if (counter == 1) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 0 * lineHeight + 10 && mouseY < textY + 1 * lineHeight + 10) {
                interacted = true;
                chalkSound.loop();
        }
    } else if (counter == 2) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 1 * lineHeight + 10 && mouseY < textY + 2 * lineHeight + 10) {
                interacted = true;
                whiteNoise.loop();
                parkNoise.setVolume(0.05);
        }
    } else if (counter == 3) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 3 * lineHeight + 10 && mouseY < textY + 4 * lineHeight + 10) {
                interacted = true;
        }
    } else if (counter == 4) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 0 * lineHeight + 10 && mouseY < textY + 1 * lineHeight + 10) {
                interacted = true;
        }
    } else if (counter == 5) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 2 * lineHeight + 10 && mouseY < textY + 3 * lineHeight + 10) {
                interacted = true;
                whooshSound.play();
        }
    } else if (counter == 6) {
        if (mouseX > textX && mouseX < textX + underlineWidth && 
            mouseY > textY + 0 * lineHeight + 10 && mouseY < textY + 1 * lineHeight + 10) {
                interacted = true;
                splashSound.play();
                window.open('park360.html');
        }
    }

    // move gradient to bottom of screen immediately when user starts interacting
    if (interacted) {
        gradientY = height;
    }
        
}


class ChalkDust {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(50, 100);
        this.angle = random(360);
    }

    display() {
        // draw w rotation
        imageMode(CENTER);
        push();
        translate(this.x, this.y);
        rotate(radians(this.angle));
        image(chalkDust, 0, 0, this.size, this.size);
        pop();
    }
}