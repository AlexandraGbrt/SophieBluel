// // Vérification si l'élément .form-login existe avant d'ajouter l'écouteur d'événements
// const formLogin = document.querySelector('.form-login');
// if (formLogin) {
//     formLogin.addEventListener('submit', async function (event) {
//         event.preventDefault();// Empêcher la soumission classique du formulaire

//         // Récupérer les valeurs des champs de formulaire
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         console.log('Email:', email, 'Password:', password); // Vérification des valeurs saisies

//         try {
//             // Effectuer la requête POST avec fetch
//             const response = await fetch('http://localhost:5678/api/users/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json' // Envoie des données JSON
//                 },
//                 body: JSON.stringify({ email, password }) // Convertir l'objet en JSON
//             });

//             // Vérifier si la réponse est OK
//             if (!response.ok) {
//                 throw new Error('Erreur de connexion, veuillez réessayer');
//             }

//             // Convertir la réponse en JSON
//             const responseData = await response.json();

//             // Vérifier la connexion -- .userId ou .success???
//             if (responseData.userId) {
//                 sessionStorage.setItem('token', responseData.token); // Stockage temporaire avec sessionStorage 
//                 window.location.href = "index.html"; // Rediriger vers index.html
//             } else {
//                 console.error("Erreur de connexion: ", responseData);
//                 alert("Identifiants incorrects.");
//             }

//         } catch (error) {
//             // Gestion des erreurs générales
//             alert("Erreur dans l’identifiant ou le mot de passe");
//             console.error('Une erreur est survenue:', error); // Pour le débogage
//         }

//     })
// };



//******************  TEST UTILISATEUR **************/

const createUser = async (event) => {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les valeurs des champs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie",
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)  // Envoie les données de l'utilisateur
        });

        // Vérifie si la réponse est ok
        if (!response.ok) { throw new Error(`Erreur : ${response.statusText}`); }

        const data = await response.json();  // Traiter la réponse JSON

        // Si un userId est retourné, la connexion est réussie
        if (data.userId) {
            localStorage.setItem('token', data.token);  // Stocke le token dans le sessionStorage
            console.log("Utilisateur connecté avec succès :", data);
            window.location.href = "index.html";  // Redirection vers la page d'accueil
        } else {
            alert("Identifiants incorrects.");
        }

    } catch (error) {
        console.error(error);
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


// Déconnexion uniquement de la page login.html ????
login.addEventListener('click', function(event) {
    if (login.innerHTML === 'logout') { // Vérifier si le texte du bouton est "logout"
        localStorage.removeItem('token'); // Supprime le token 
        console.log('Vous êtes déconnecté');
        window.location.href = "./login.html"; 
    } else {
        console.log('Vous devez d\'abord vous connecter.');
    }
});
