# Magnetic Text Repulsion Component

## Snippet Extract
```css
/* --- SNIPPET EXTRACT --- */
.letter.repelled {
    animation: repelAnimation 0.5s ease-out;
}

@keyframes repelAnimation {
    0% { transform: scale(1) rotateY(0deg); }
    50% { 
        transform: scale(0.8) rotateY(180deg) 
        translateX(var(--repel-x, 0)) 
        translateY(var(--repel-y, 0)); 
    }
    100% { transform: scale(1) rotateY(0deg); }
}

const repelX = -angleX * repelStrength * 100;
const repelY = -angleY * repelStrength * 50;
letter.style.transform = `
    translateX(${repelX}px) 
    translateY(${repelY}px) 
    rotateY(${rotation}deg) 
    scale(${scale})
`;
/* --- END SNIPPET --- */
```

## Instagram Reel Metadata

**Caption:**
✨ Magnetic text that runs away from your cursor! 🧲
Watch these letters scatter and snap back with smooth animations
Perfect example of interactive web design in action 🎨
Can you catch all the letters? 💫

**Hashtags:**
#MagneticText #WebAnimation #InteractiveDesign #CSSHTML #CodeArt #WebDev #FrontEndDev #CreativeCoding #UIAnimation #WebDesign

## YouTube Shorts Metadata

**Title:** "Magnetic Text Effect That Runs Away From Your Cursor! 🧲✨"

**Description:**
Watch this mesmerizing magnetic text repulsion effect in action! Letters scatter when your cursor approaches and smoothly snap back into place. Built with pure HTML, CSS, and JavaScript.

**Hashtags:**
#Shorts #WebAnimation #MagneticText #InteractiveDesign #CSSAnimation #JavaScript #WebDev #FrontEnd #CreativeCoding #CodeArt