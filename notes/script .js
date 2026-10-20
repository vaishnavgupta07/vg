// script.js

// Mobile Menu
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
if(btn && menu) {
    btn.addEventListener('click', () => { menu.classList.toggle('hidden'); });
    const mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(link => { link.addEventListener('click', () => { menu.classList.add('hidden'); }); });
}

// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
            b.className = 'tab-btn bg-white border border-gray-200 text-gray-500 hover:text-brand-600 hover:border-brand-300 hover:shadow-md rounded-xl p-6 font-bold transition-all focus:outline-none text-center';
        });
        btn.className = 'tab-btn bg-brand-50 border-2 border-brand-500 text-brand-700 shadow-md rounded-xl p-6 font-bold transition-all focus:outline-none text-center transform scale-105';

        tabContents.forEach(content => {
            content.classList.remove('block');
            content.classList.add('hidden');
        });

        const targetId = btn.getAttribute('data-target');
        if(document.getElementById(targetId)) {
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('block');
        }
    });
});

// Sign Out Logic
function signOut() {
    localStorage.removeItem('visitorName');
    localStorage.removeItem('visitorTimestamp');
    
    document.getElementById('desktop-user-info').classList.add('hidden');
    document.getElementById('mobile-user-info').classList.add('hidden');
    
    document.getElementById('modal-step-1').classList.remove('hidden');
    document.getElementById('modal-step-2').classList.add('hidden');
    document.getElementById('visitor-name').value = ''; 
    document.getElementById('welcome-modal').classList.remove('hidden');
}

// Welcome Popup Logic
function updateNavName(name) {
    const desktopInfo = document.getElementById('desktop-user-info');
    const mobileInfo = document.getElementById('mobile-user-info');
    const desktopName = document.getElementById('nav-visitor-name-desktop');
    const mobileName = document.getElementById('nav-visitor-name-mobile');
    
    if (desktopInfo && mobileInfo) {
        desktopName.innerText = "Hi, " + name + " 👋";
        mobileName.innerText = "Hi, " + name + " 👋";
        
        desktopInfo.classList.remove('hidden');
        mobileInfo.classList.remove('hidden');
    }
}

// 5 ghante wale timer ka logic
document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem('visitorName');
    const savedTime = localStorage.getItem('visitorTimestamp');
    
    const now = new Date().getTime();
    const fiveHours = 5 * 60 * 60 * 1000;
    
    let shouldAskName = true;

    if (savedName && savedTime) {
        if (now - parseInt(savedTime) < fiveHours) {
            shouldAskName = false;
        } else {
            localStorage.removeItem('visitorName');
            localStorage.removeItem('visitorTimestamp');
        }
    }
    
    if (shouldAskName) {
        setTimeout(() => {
            if(document.getElementById('modal-step-1')) {
                document.getElementById('modal-step-1').classList.remove('hidden');
                document.getElementById('modal-step-2').classList.add('hidden');
                document.getElementById('visitor-name').value = ''; 
                document.getElementById('welcome-modal').classList.remove('hidden');
            }
        }, 500); 
    } else {
        updateNavName(savedName);
    }
});

function submitName() {
    const nameInput = document.getElementById('visitor-name').value.trim();
    const lowerName = nameInput.toLowerCase();
    
    if (nameInput === "") {
        alert("Please enter your name!");
        return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameInput)) {
        alert("Please enter a valid name! (Numbers and symbols are not allowed)");
        return;
    }

    if (nameInput.length < 3 || nameInput.length > 25) {
        alert("Please enter your full real name.");
        return;
    }

    if (lowerName.includes("vaishnav") || lowerName.includes("vsg")) {
        alert("Hey! That's my name. Please enter YOUR name! 😄");
        return;
    }

    const fakeNames = ["abc", "xyz", "asd", "qwe", "zxc", "test", "dummy", "admin", "user", "guest", "asdf", "qwer", "zxcv", "abcd", "qaz", "wsx", "edc", "rfv", "tgb", "yhn", "ujm", "ikm", "none"];
    const isFake = fakeNames.some(fake => lowerName === fake);
    if (isFake) {
        alert("Please enter a proper real name! (Fake words are not allowed 🤨)");
        return;
    }

    // Gali (Bad Words) Filter
    const badWords = ["idiot", "stupid", "pagal", "kutta", "kamina", "gali1", "gali2", "bastard", "bitch", "fuck", "shit", "asshole"];
    const hasBadWord = badWords.some(badWord => lowerName.includes(badWord));
    if (hasBadWord) {
        alert("Warning: Inappropriate language detected! Please behave respectfully. 🚫");
        return;
    }

    const hasVowel = /[aeiouyAEIOUY]/.test(nameInput);
    const threeConsecutive = /(.)\1{2,}/.test(nameInput);
    const fourConsonants = /[^aeiouyAEIOUY\s]{4,}/.test(nameInput);
    const startWithDoubleConsonant = /^([^aeiouyAEIOUY\s])\1/i.test(nameInput);
    const uniqueChars = new Set(lowerName.replace(/\s/g, '')).size;

    if (!hasVowel || threeConsecutive || fourConsonants || startWithDoubleConsonant || uniqueChars < 3) {
        alert("Please enter a proper real human name! 🤨");
        return;
    }

    const name = nameInput;
    
    document.getElementById('modal-step-1').classList.add('hidden');
    document.getElementById('modal-step-2').classList.remove('hidden');
    document.getElementById('display-name').innerText = name;

    localStorage.setItem('visitorName', name);
    localStorage.setItem('visitorTimestamp', new Date().getTime());
    updateNavName(name); 

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzi6LiuI-TkGBGCRk1kfmyu0FKYRVeTsu-3m0v_D3vnXXiIlEs-f6zlRmHj1PzXI2W61A/exec'; 
    const formData = new FormData();
    formData.append('name', name);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => console.log('Name saved successfully!'))
        .catch(error => console.error('Error!', error.message));

    setTimeout(() => {
        document.getElementById('welcome-modal').classList.add('hidden');
    }, 2500);
}

const visitorNameInput = document.getElementById("visitor-name");
if(visitorNameInput) {
    visitorNameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitName();
        }
    });
}
window.$crisp=[];
window.CRISP_WEBSITE_ID="75d4f305-dcf3-4ea4-a8b2-833c0433a580";
(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
