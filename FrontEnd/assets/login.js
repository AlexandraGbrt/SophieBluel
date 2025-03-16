
const baseUrl = "http://localhost:5678/api";

const createUser = async (event) => {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les valeurs des champs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // const userData = {
    //     email: "sophie.bluel@test.tld",
    //     password: "S0phie",
    // };

    // Les identifiants de Sophie
    const validEmail = "sophie.bluel@test.tld";
    const validPassword = "S0phie";

    // Vérifie si l'utilisateur a saisi les bons identifiants
    if (email === validEmail && password === validPassword) {
        const userData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch(`${baseUrl}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)  // Envoie les données de l'utilisateur
            });

            if (!response.ok) {
                throw new Error(`Erreur : ${response.statusText}`);
            }

            const data = await response.json();  // Traiter la réponse JSON
            console.log("Réponse du serveur:", data);

            // Si un userId est retourné, la connexion est réussie
            if (data.userId) {
                localStorage.setItem('token', data.token);  // Stocke le token dans le localStorage
                console.log("Utilisateur connecté avec succès :", data);
                window.location.href = "index.html";  // Redirection vers la page d'accueil
            } else {
                console.error("Identifiants incorrects : utilisateur non trouvé.");
                alert("Identifiants incorrects.");
            }

        } catch (error) {
            console.error(error);
            alert("Erreur dans l'identifiant ou le mot de passe");
        }
    } else {
        console.error("Identifiants incorrects saisis.");
        alert("Erreur dans l'identifiant ou le mot de passe");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login');  // Sélectionne le formulaire par sa classe
    if (form) {
        form.addEventListener("submit", createUser);  // Attacher l'événement si le formulaire existe
    } else {
        console.error('Le formulaire n\'a pas été trouvé.');
    }
});




//**************** MODE EDITION ***********//

var token = localStorage.getItem('token');
console.log(token);

let isUserLoggedIn = (token != null);

const editTopBar = document.querySelector('.edition-top-bar');
editTopBar.style.display = (isUserLoggedIn) ? 'block' : 'none';


//************* CONNEXION ****************//
const login = document.querySelector('.login');
login.innerHTML = (isUserLoggedIn) ? 'logout' : 'login';



// Déconnexion 

login.addEventListener('click', function (event) {
    if (login.innerHTML === 'logout') { // Vérifier si le texte du bouton est "logout"
        localStorage.removeItem('token'); // Supprime le token 
        console.log('Vous êtes déconnecté');
        window.location.href = "./login.html";
    } else {
        console.log('Vous devez d\'abord vous connecter.');
    }
});
