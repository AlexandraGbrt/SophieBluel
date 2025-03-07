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





// TEST UTILISATEUR 


// Variable d'état pour savoir si l'utilisateur est connecté
// let isLoggedIn = false;

// // Fonction pour activer le mode édition
// function toggleEditMode() {
//     const editModeBar = document.querySelector('.edition-top-bar'); // Sélectionne la barre par classe
//     if (isLoggedIn) {
//         editModeBar.style.display = 'block'; // Affiche la barre
//     } else {
//         editModeBar.style.display = 'none'; // Cache la barre
//     }
// }


const createUser = async (event) => {
    event.preventDefault();  // Empêche le comportement par défaut (rechargement de la page)

    // Récupérer les valeurs des champs du formulaire
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
            sessionStorage.setItem('token', data.token);  // Stocker le token dans le sessionStorage
            // isLoggedIn = true; // marquer l'utilisateur connecté
            // toggleEditMode(); // appelle la fonction
            console.log("Utilisateur connecté avec succès :", data);
            window.location.href = "index.html";  // Redirection vers la page d'accueil
        } else {
            alert("Identifiants incorrects.");
        }

    } catch (error) {
        console.error(error);  // Affiche l'erreur dans la console
        alert("Erreur dans l'identifiant ou le mot de passe");  // Affiche un message d'erreur à l'utilisateur
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login');  // Sélectionne le formulaire par sa classe

    if (form) {
        form.addEventListener("submit", createUser);  // Attacher l'événement si le formulaire existe
    } else {
        console.error('Le formulaire n\'a pas été trouvé.');
    }

    // toggleEditMode(); // Vérifier l'état de connexion
});


// MODE EDITION // 

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM entièrement chargé et analysé');

//     const token = sessionStorage.getItem('token'); // Récupérer le token de session
//     const topBar = document.querySelector('.edition-top-bar');
//     const editButton = document.querySelector('.edition-link');
//     const authLink = document.querySelector('.bold-login'); // lien header login 

//     const currentPage = window.location.pathname.split('/').pop();

//     if (currentPage === "index.html" || currentPage === "login.html") {
//         if (token) {
//             topBar.style.display = 'flex'; // Afficher la barre en haut
//             editButton.style.display = 'inline-block'; // Afficher le bouton "Modifier"
//             authLink.textContent = 'logout'; // remplace 'login' par 'logout' une fois connecté
//             authLink.onclick = () => {
//                 sessionStorage.removeItem('token'); // retire le token si click sur 'logout'
//                 window.location.reload(); // recharge la page
//             };
//         } else {
//             topBar.style.display = 'none'; // Masquer la barre
//             editButton.style.display = 'none'; // Masquer le bouton "Modifier"
//             authLink.textContent = 'login';
//             authLink.onclick = () => {
//                 window.location.href = "login.html";
//             };
//         }
//     }
// });
