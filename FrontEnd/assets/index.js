const baseUrl = "http://localhost:5678/api"

//***************  AFFICHER LES PROJETS  ************//

async function fetchData(url) {
  try {
    const response = await fetch(url); // Effectuer la requête HTTP
    if (!response.ok) { // Vérifier si la réponse est correcte (status 200-299)
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Parse la réponse JSON
    return data; // Retourner les données
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Fonction pour afficher les projets
async function showWorks() {
  const data = await fetchData(`${baseUrl}/works`);
  const gallery = document.querySelector('.gallery');

  let galleryHTML = ''; // Sert de conteneur pour chaque projet
  data.forEach(function (work) {
    // Construire le HTML pour chaque projet
    galleryHTML += `
      <figure class="work-item" data-category="${work.category.name}">
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      </figure>
    `;
  });
  gallery.innerHTML = galleryHTML; // Contenu de chaque projet dans le conteneur global

}

showWorks();




//***************  AFFICHER LES CATEGORIES  ************//

async function showCategories() {
  const data = await fetchData(`${baseUrl}/categories`);

  // Ajouter la catégorie "Tous" 
  const categories = [{ name: "Tous" }, ...data];

  const menu = document.createElement('ul');
  menu.id = 'menu_categories';

  // Générer le HTML pour chaque catégorie avec forEach
  let menuHTML = '';  // Initialisation de la chaîne vide pour le HTML
  categories.forEach(category => {
    menuHTML += `
    <li><button class="category-btn" data-category="${category.name}">${category.name}</button></li>
    `;
  });

  menu.innerHTML = menuHTML;  // Ajouter le HTML généré dans le menu

  // Insérer le menu avant la galerie
  document.querySelector('#portfolio .gallery')?.insertAdjacentElement('beforebegin', menu);

  // Ajouter des gestionnaires d'événements aux boutons de catégorie
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedCategory = button.getAttribute('data-category');
      filterWorks(selectedCategory); // Filtrer les travaux selon la catégorie
    });
  });
}

showCategories();





//***************  FILTRER LES PROJETS  ************//

function filterWorks(selectedCategory) {
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach(workItem => {
    const workCategory = workItem.getAttribute('data-category');

    workItem.style.display = (selectedCategory === "Tous" || workCategory === selectedCategory) ? 'block' : 'none';
  });
}




//**************** MODE EDITION ***********//

var token = localStorage.getItem('token');
console.log(token);

let isUserLoggedIn = (token != null);

// Recupere les elements
const editLink = document.querySelector('.edition-link');
const editTopBar = document.querySelector('.edition-top-bar');

// Si token different de "null" alors valeur 1 sinon valeur 2
editLink.style.display = (isUserLoggedIn) ? 'block' : 'none';
editTopBar.style.display = (isUserLoggedIn) ? 'block' : 'none';

const login = document.querySelector('.login');
// Si token different de null alors valeur 1 sinon valeur 2
login.innerHTML = (isUserLoggedIn) ? 'logout' : 'login';


// DECONNEXION
login.addEventListener('click', function (event) {
  if (login.innerHTML === 'logout') { // Vérifier si le texte du bouton est "logout"
    localStorage.removeItem('token'); // Supprime le token 
    console.log('Vous êtes déconnecté');
    window.location.href = "./login.html";
  } else {
    console.log('Vous devez d\'abord vous connecter.');
  }
});




//***************  MODALE ************//

async function showWorksInModal() {
  const data = await fetchData(`${baseUrl}/works`);
  const projectList = document.getElementById('project-list'); // Zone de la modale pour afficher les images

  projectList.innerHTML = ''; // Vider le contenu précédent

  // Construire le HTML pour chaque projet
  data.forEach(function (work) {
    const imageItem = document.createElement('div'); // Créer un élément div pour chaque image
    imageItem.classList.add('image-item');

    imageItem.innerHTML = `
          <img src="${work.imageUrl}" alt="Projet" class="modal-image">
          <i class="fa-solid fa-trash-can delete-icone" data-projet-id="${work.id}"></i>
      `;
    projectList.appendChild(imageItem); // Ajouter l'image à la liste de la modale
  });

  // fonction de suppression des projets
  deleteWorks();
}


//**************** SUPPRESSION DES PROJETS *******************/

function deleteWorks() {
  const deleteIcons = document.querySelectorAll('.delete-icone'); // récupérer les 'delete-icone'

  deleteIcons.forEach(icon => {
    icon.addEventListener('click', async function () {
      const projetId = icon.getAttribute('data-projet-id'); // Récupérer l'ID du projet 
      const token = localStorage.getItem('token');
      // Vérifier si le token est présent
      if (!token) {
        return; // On arrête la fonction si token absent
      }

      // Confirmer la suppression
      if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {

        try {
          const response = await fetch(`${baseUrl}/works/${projetId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });

          if (response.ok) {
            // alert("Le projet a été supprimé !");
            icon.closest('div').remove(); // supprime le projet


          } else {
            alert("Échec de la suppression du projet.");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du projet:", error);
        }
      }
    });
  });
}




//****************** AJOUTER UN PROJET *****************/

const form = document.querySelector('.form-add-photo')

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form); // crée un objet avec les données du formulaire
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Vous devez être connecté pour ajouter un projet.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/works`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData, // envoi des données sous forme de FormData
    });

    if (response.ok) {
      const newWork = await response.json();
      console.log('Projet ajouté :', newWork);

      const workList = document.querySelector('.gallery');
      const newWorkItem = document.createElement('figure');
      newWorkItem.classList.add('work-item');
      newWorkItem.innerHTML = `
        <figure class="work-item" data-category="${newWork.categoryId}">
          <img src="${newWork.imageUrl}" alt="${newWork.title}">
          <figcaption>${newWork.title}</figcaption>
        </figure>
        `;
      workList.appendChild(newWorkItem);

      // Réattacher les événements de suppression au NOUVEAU projet
      deleteWorks();

    } else {
      alert("Échec de l'ajout du projet.");
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
});


//*************** Vérifie le contenu des champs du formulaire */

const validateBtn = form.querySelector('.validate-btn');
const inputPhoto = form.querySelector('#inputPhoto');
const title = form.querySelector('#title');
const photoCategory = form.querySelector('#photo-category');

function colorValidateBtn() {
  // Vérifier si tous les champs sont remplis
  if (inputPhoto.files.length > 0 && title.value !== "" && photoCategory.value !== "") {
    validateBtn.classList.add("active");  // Le bouton devient vert
  } else {
    validateBtn.classList.remove("active");  // Le bouton redevient gris
  }
}

// Ajouter des événements d'écoute pour chaque champ de formulaire
inputPhoto.addEventListener('change', colorValidateBtn);
title.addEventListener('input', colorValidateBtn);
photoCategory.addEventListener('change', colorValidateBtn);


//*************** Aperçu de l'image selectionnée ****/

const photoInput = document.getElementById('inputPhoto');
const areaInputPhoto = document.querySelector('.areaInputPhoto');

photoInput.addEventListener('change', function (event) {
  const file = event.target.files[0]; // Récupère le fichier sélectionné

  if (file) {
    const reader = new FileReader(); // crée un objet FileReader pour lire le contenu

    reader.onload = function (e) { // action à effectuer quand la lecture est terminée
      const imageURL = e.target.result;

      // Créer un nouvel élément image
      const photoPreview = document.createElement('img');
      photoPreview.src = imageURL;
      photoPreview.style.maxHeight = '100%';
      photoPreview.style.objectFit = 'contain';

      // Masquer les éléments existants (input, label, icône)
      const icon = areaInputPhoto.querySelector('i');
      const label = areaInputPhoto.querySelector('label');
      const input = areaInputPhoto.querySelector('input');
      const span = areaInputPhoto.querySelector('span');

      icon.style.display = 'none';
      label.style.display = 'none';  
      input.style.display = 'none';  
      span.style.display = 'none';

      areaInputPhoto.appendChild(photoPreview); // Ajouter l'image dans la zone
    };

    reader.readAsDataURL(file);
  }
});









//******************* OUVERTURE-FERMETURE DES MODALES *******************/

// Récupère les divs pour ouvrir et fermer les modales
const editWorksModal = document.getElementById('editProjectModal');
const addPhotoModal = document.getElementById('addPhotoModal');

// Ouvrir la modale 1 et afficher les projets
async function openEditWorksModal() {
  editWorksModal.style.display = 'block';
  await showWorksInModal();
}

// Fermer la modale 1
function closeEditWorksModal() {
  editWorksModal.style.display = 'none';
}

// Ouvrir la modale 2 (Ajouter une photo)
function openAddPhotoModal() {
  addPhotoModal.style.display = 'block';
}

// Fermer la modale 2
function closeAddPhotoModal() {
  addPhotoModal.style.display = 'none';
}

// Ouvrir et fermer la modale 1
document.getElementById('openModalButton').addEventListener('click', openEditWorksModal);
document.querySelector('.close-button').addEventListener('click', closeEditWorksModal);

// Ouvrir  la modale 2 (Ajouter une photo)
document.querySelector('.add-photo').addEventListener('click', openAddPhotoModal);

// fermeture des deux modales quand on clique sur le bouton de fermeture de la modale 2
document.querySelector('#addPhotoModal .close-button').addEventListener('click', () => {
  closeEditWorksModal();
  closeAddPhotoModal();
});

// revenir à la modale 1
document.querySelector('.back-arrow-btn').addEventListener('click', () => {
  closeAddPhotoModal();
  openEditWorksModal();
});

// Ferme les deux modales si clic en dehors de la modale
window.addEventListener('click', (event) => {
  if (event.target === editWorksModal || event.target === addPhotoModal) {
    closeEditWorksModal();
    closeAddPhotoModal();
  }
});


/**************** AFFICHER LES CATEGORIES DANS LA MODALE 2 ************/

async function showCategoriesInModal() {
  const data = await fetchData(`${baseUrl}/categories`);

  const selectElement = document.getElementById('photo-category'); // Cible l'élément select de la modale

  // Vider le select avant d'ajouter les nouvelles options
  selectElement.innerHTML = '';

  // Ajouter une option vide pour choisir la catégorie
  const categoryOption = document.createElement('option');
  categoryOption.value = '';
  selectElement.appendChild(categoryOption);

  data.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id; // Utiliser le nom de la catégorie comme valeur
    option.textContent = category.name; // Afficher le nom de la catégorie
    selectElement.appendChild(option);
  });
}

showCategoriesInModal();




