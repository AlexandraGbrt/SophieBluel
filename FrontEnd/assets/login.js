// // Vérification si l'élément .form_login existe avant d'ajouter l'écouteur d'événements
// const formLogin = document.querySelector('.form_login');
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

const createUser = async (event) => {
    event.preventDefault();
    // console.log("Formulaire soumis");

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
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Erreur : ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Réponse de l\'API:', data);

        // data.userId et non data.success !!!
        if (data.userId) {
            // Stockage
            sessionStorage.setItem('token', data.token);
            console.log("Utilisateur connecté avec succès :", data);
            // Redirection 
            window.location.href = "index.html";
        } else {
            console.error("Erreur de connexion: ", data);
            alert("Identifiants incorrects.");
        }

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur s'est produite lors de la connexion."); // Informer l'utilisateur
    }
};

// createUser();

const form = document.querySelector('.form_login');
form.addEventListener('submit', createUser);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form_login');
    console.log("Formulaire trouvé :", form);
});



// MODE EDITION // 

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token'); // Récupérer le token de session
    const topBar = document.querySelector('.edition-top-bar');
    const editButton = document.querySelector('.edition-link');

    // Vérifie si l'URL correspond à 'index.html' ou 'login.html'
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === "index.html" || currentPage === "login.html") {
        // Si on est sur index.html ou login.html, on continue
        if (token) {
            // Si le token est présent, cela signifie que l'utilisateur est connecté
            topBar.style.display = 'flex'; // Afficher la barre en haut
            editButton.style.display = 'inline-block'; // Afficher le bouton "Modifier"

            // Ajouter une action pour le bouton "Modifier"
            editButton.addEventListener('click', () => {
                alert("Mode édition activé");
                // Logique pour activer le mode édition, par exemple
            });
        } else {
            // Si le token n'est pas présent, cela signifie que l'utilisateur n'est pas connecté
            topBar.style.display = 'none'; // Masquer la barre
            editButton.style.display = 'none'; // Masquer le bouton "Modifier"
        }
    }
});

  