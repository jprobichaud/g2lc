// G2LC Website - Application JavaScript

// Configuration des fichiers
// Pour ajouter des fichiers, ajoutez-les dans ces listes
const FILES = {
    documents: [
        'rapport_11-10.txt',
        'rapport_11-17.txt',
        'rapport_11-24.txt',
        'rapport_12-01.txt',
        'rapport_12-08.txt',
        'rapport_12-15.txt',
        'rapport_01-05.txt',
        'rapport_01-12.txt',
        'rapport_01-19.txt',
        'emailchatter_snapshot1.png',
        'emailchatter_snapshot2.png',
        'emailchatter_snapshot3.png',
        'delete.me'
    ],
    eric: [
        '11-01.txt',
        '11-06.txt',
        '11-07.txt',
        '11-10.txt',
        '11-12.txt',
        '11-17.txt',
        '11-23.txt',
        '12-02.txt',
        '12-07.txt',
        '12-15.txt',
        '12-19.txt',
        '12-22.txt',
        '12-27.txt',
        '01-06.txt',
        '01-10.txt',
        '01-15.txt',
        '01-18.txt',
        '01-20.txt',
        '01-24.txt',
        '01-25.txt',
        '01-29.txt',
        'rapport_12-22.txt',
        'rapport_final_01-26.txt',
        'avis metivier.png'
    ]
};

// État de l'application
let isLoggedIn = false;
let isEricUnlocked = false;
let currentFolder = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initLogin();
    initJuliuIS();
    initModal();

    // Vérifier si déjà connecté (session)
    if (sessionStorage.getItem('g2lc_logged_in') === 'true') {
        isLoggedIn = true;
        showJuliuISNav();
    }

    // Vérifier si dossier Éric déjà déverrouillé
    if (sessionStorage.getItem('g2lc_eric_unlocked') === 'true') {
        isEricUnlocked = true;
    }
});

// Navigation SPA
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');

            // Vérifier accès à juliuis
            if (pageId === 'juliuis' && !isLoggedIn) {
                return;
            }

            showPage(pageId);

            // Mettre à jour nav active
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
        });
    });
}

function showPage(pageId) {
    // Cacher toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
        page.classList.remove('active');
    });

    // Afficher la page demandée
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Login
function initLogin() {
    const btnLogin = document.getElementById('btn-login');
    const btnCancel = document.getElementById('btn-cancel');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('login-error');

    btnLogin.addEventListener('click', function() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Vérification des credentials
        if (username === 'Éric Langlois' && password === 'JuliuIS') {
            isLoggedIn = true;
            sessionStorage.setItem('g2lc_logged_in', 'true');
            errorMsg.textContent = '';
            showJuliuISNav();
            showPage('accueil');

            // Mettre à jour nav
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            document.querySelector('[data-page="accueil"]').classList.add('active');
        } else {
            errorMsg.textContent = 'Identifiants incorrects.';
        }
    });

    btnCancel.addEventListener('click', function() {
        usernameInput.value = '';
        passwordInput.value = '';
        errorMsg.textContent = '';
        showPage('accueil');

        document.querySelectorAll('.nav-link').forEach(function(l) {
            l.classList.remove('active');
        });
        document.querySelector('[data-page="accueil"]').classList.add('active');
    });

    // Enter pour soumettre
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btnLogin.click();
        }
    });
}

function showJuliuISNav() {
    const navJuliuis = document.getElementById('nav-juliuis');
    navJuliuis.classList.remove('nav-hidden');
}

// Page JuliuIS
function initJuliuIS() {
    const btnPlan = document.getElementById('btn-plan');
    const btnDocuments = document.getElementById('btn-documents');
    const btnEric = document.getElementById('btn-eric');

    btnPlan.addEventListener('click', function() {
        openPlanModal();
    });

    btnDocuments.addEventListener('click', function() {
        setActiveButton(this);
        currentFolder = 'documents';
        loadFileList('documents');
    });

    btnEric.addEventListener('click', function() {
        // Vérifier si déjà déverrouillé
        if (isEricUnlocked) {
            setActiveButton(this);
            currentFolder = 'eric';
            loadFileList('eric');
            return;
        }

        // Demander le mot de passe
        var pwd = prompt('Mot de passe requis pour accéder aux fichiers d\'Éric:');
        if (pwd === 'XxcdGtmPIL47') {
            isEricUnlocked = true;
            sessionStorage.setItem('g2lc_eric_unlocked', 'true');
            setActiveButton(btnEric);
            currentFolder = 'eric';
            loadFileList('eric');
        } else if (pwd !== null) {
            alert('Mot de passe incorrect.');
        }
    });
}

function setActiveButton(btn) {
    document.querySelectorAll('.juliuis-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');
}

function loadFileList(folder) {
    const fileList = document.getElementById('file-list');
    const fileContent = document.getElementById('file-content');

    fileList.innerHTML = '';
    fileContent.innerHTML = 'Sélectionnez un fichier pour voir son contenu.';

    const files = FILES[folder] || [];

    // Ajouter les fichiers (texte et images)
    files.forEach(function(filename) {
        const li = document.createElement('li');
        const isImage = filename.match(/\.(png|jpg|jpeg|gif)$/i);
        const icon = isImage ? '🖼️' : '📄';
        li.innerHTML = '<span class="file-icon">' + icon + '</span> ' + filename;
        li.addEventListener('click', function() {
            selectItem(this);
            loadFileContent(folder, filename);
        });
        fileList.appendChild(li);
    });

    // Ajouter les vidéos (filtrées par folder)
    if (typeof VIDEOS !== 'undefined') {
        VIDEOS.forEach(function(video) {
            // Si folder n'est pas défini sur la vidéo, défaut = 'documents'
            var videoFolder = video.folder || 'documents';
            if (videoFolder === folder) {
                const li = document.createElement('li');
                li.innerHTML = '<span class="file-icon play-icon">▶</span> ' + video.title + '.mp4';
                li.classList.add('video-item');
                li.addEventListener('click', function() {
                    selectItem(this);
                    loadVideo(video.id);
                });
                fileList.appendChild(li);
            }
        });
    }
}

function selectItem(element) {
    document.querySelectorAll('#file-list li').forEach(function(item) {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
}

function loadFileContent(folder, filename) {
    const fileContent = document.getElementById('file-content');
    const path = folder + '/' + filename;

    // Si c'est une image, afficher directement
    if (filename.match(/\.(png|jpg|jpeg|gif)$/i)) {
        fileContent.innerHTML = '<div class="image-container"><img src="' + path + '" alt="' + filename + '"></div>';
        return;
    }

    fileContent.innerHTML = '<div class="loading">Chargement...</div>';

    fetch(path)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Fichier non trouvé');
            }
            return response.text();
        })
        .then(function(text) {
            fileContent.innerHTML = '<pre class="text-content">' + escapeHtml(text) + '</pre>';
        })
        .catch(function(error) {
            fileContent.innerHTML = '<div class="error">Erreur: Impossible de charger le fichier.</div>';
        });
}

function loadVideo(videoId) {
    const fileContent = document.getElementById('file-content');
    fileContent.innerHTML = '<div class="video-container"><iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe></div>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal Plan
function initModal() {
    const modal = document.getElementById('modal-plan');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', function() {
        closePlanModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePlanModal();
        }
    });

    // Escape pour fermer
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlanModal();
        }
    });
}

function openPlanModal() {
    const modal = document.getElementById('modal-plan');
    const iframe = document.getElementById('plan-iframe');
    iframe.src = 'plan_juliuis.html';
    modal.classList.add('show');
}

function closePlanModal() {
    const modal = document.getElementById('modal-plan');
    const iframe = document.getElementById('plan-iframe');
    modal.classList.remove('show');
    iframe.src = '';
}
