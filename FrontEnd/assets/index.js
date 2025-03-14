

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
  const data = await fetchData('http://localhost:5678/api/works');
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
  const data = await fetchData('http://localhost:5678/api/categories');

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
    const workCategory = workItem.getAttribute('data-category'); // Utiliser l'attribut data-category

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
  const data = await fetchData('http://localhost:5678/api/works');
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
      const token = localStorage.getItem('token');  // Vérifier si le token est présent

      if (!token) {
        return; // On arrête la fonction si token absent
      }

      // Confirmer la suppression
      if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        try {
          const response = await fetch(`http://localhost:5678/api/works/${projetId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });

          if (response.ok) {
            alert("Le projet a été supprimé !");
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

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Vous devez être connecté pour ajouter un projet.");
    return;
  }

  try {
    const response = await fetch('http://localhost:5678/api/works', {
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
        <figure class="work-item" data-category="${newWork.category.name}">
          <img src="${newWork.imageUrl}" alt="${newWork.title}">
          <figcaption>${newWork.title}</figcaption>
        </figure>
        `;
      workList.appendChild(newWorkItem);
    } else {
      alert("Échec de l'ajout du projet.");
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
});










//******************* OUVERTURE-FERMETURE DES MODALES *******************/

// Récupère les divs pour ouvrir et fermer les modales
const modal1 = document.getElementById('editProjectModal');
const modal2 = document.getElementById('addPhotoModal');

// Ouvrir la modale 1 et afficher les projets
async function openModal1() {
  modal1.style.display = 'block';
  await showWorksInModal();
}

// Fermer la modale 1
function closeModal1() {
  modal1.style.display = 'none';
}

// Ouvrir la modale 2 (Ajouter une photo)
function openModal2() {
  modal2.style.display = 'block';
}

// Fermer la modale 2
function closeModal2() {
  modal2.style.display = 'none';
}

// Ouvrir et fermer la modale 1
document.getElementById('openModalButton').addEventListener('click', openModal1);
document.querySelector('.close-button').addEventListener('click', closeModal1);

// Ouvrir  la modale 2 (Ajouter une photo)
document.querySelector('.add-photo').addEventListener('click', openModal2);

// fermeture des deux modales quand on clique sur le bouton de fermeture de la modale 2
document.querySelector('#addPhotoModal .close-button').addEventListener('click', () => {
  closeModal1();
  closeModal2();
});

// revenir à la modale 1
document.querySelector('.back-arrow-btn').addEventListener('click', () => {
  closeModal2();
  openModal1();
});

// Ferme les deux modales si clic en dehors de la modale
window.addEventListener('click', (event) => {
  if (event.target === modal1 || event.target === modal2) {
    closeModal1();
    closeModal2();
  }
  // (event.target === modal1 || event.target === modal2) ? (closeModal1(), closeModal2()) : null;
});


/**************** AFFICHER LES CATEGORIES DANS LA MODALE 2 ************/

async function showCategoriesInModal() {
  const data = await fetchData('http://localhost:5678/api/categories');

  const selectElement = document.getElementById('photo-category'); // Cible l'élément select de la modale

  // Vider le select avant d'ajouter les nouvelles options
  selectElement.innerHTML = '';

  // Ajouter une option vide pour choisir la catégorie
  const categoryOption = document.createElement('option');
  categoryOption.value = '';
  selectElement.appendChild(categoryOption);

  data.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name; // Utiliser le nom de la catégorie comme valeur
    option.textContent = category.name; // Afficher le nom de la catégorie
    selectElement.appendChild(option);
  });
}

showCategoriesInModal();




