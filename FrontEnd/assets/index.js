//***************  MODALE ************//

// Fonction pour afficher uniquement les photos des projets dans la modale
async function showWorksInModal() {
  const data = await fetchData('http://localhost:5678/api/works'); // Récupérer les données des projets
  const projectList = document.getElementById('project-list'); // Zone de la modale pour afficher les images

  projectList.innerHTML = ''; // Vider le contenu précédent

  // Construire le HTML pour chaque projet
  data.forEach(function (work) {
      const imageItem = document.createElement('div'); // Créer un élément div pour chaque image
      imageItem.classList.add('image-item'); // ?????

      imageItem.innerHTML = `
          <img src="${work.imageUrl}" alt="Projet" class="modal-image">
          <i class="fa-solid fa-trash-can delete-icone"></i>
      `;
      projectList.appendChild(imageItem); // Ajouter l'image à la liste de la modale
  });
}

// Appeler cette fonction lors de l'ouverture de la modale
async function openModal() {
  const modal = document.getElementById('editProjectModal');
  modal.style.display = 'block';

  // Appeler la fonction pour afficher les projets dans la modale
  await showWorksInModal();
}

// Fermer la modale
function closeModal() {
  const modal = document.getElementById('editProjectModal');
  modal.style.display = 'none';
}

// Associer les événements pour ouvrir et fermer la modale
document.getElementById('openModalButton').addEventListener('click', openModal);
document.querySelector('.close-button').addEventListener('click', closeModal);





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

// Fonction pour afficher les catégories et ajouter des événements de clic
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
    button.addEventListener('click', function() {
      const selectedCategory = button.getAttribute('data-category');
      filterWorks(selectedCategory); // Filtrer les travaux selon la catégorie
    });
  });
}

showCategories(); 


// Fonction pour filtrer et trier les projets selon la catégorie sélectionnée
function filterWorks(selectedCategory) {
  const workItems = document.querySelectorAll('.work-item');

 workItems.forEach(workItem => {
    const workCategory = workItem.getAttribute('data-category'); // Utiliser l'attribut data-category

    if (selectedCategory === "Tous" || workCategory === selectedCategory) {
      workItem.style.display = 'block'; // Afficher le projet
    } else {
      workItem.style.display = 'none'; // Masquer le projet
    }
  });
}

