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

async function showWorks() {
  const data = await fetchData('http://localhost:5678/api/works');
  const gallery = document.querySelector('.gallery'); 
  
  let galleryHTML = ''; // initialiser une chaine de caractère vide et sert de conteneur pour chaque projet
  data.forEach(function(work) {
    // Construire le HTML pour chaque projet
    galleryHTML += `
      <figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      </figure>
    `;
  });
  gallery.innerHTML = galleryHTML; // contenu de chaque projet dans le conteneur global
}
// Appeler la fonction pour les projets
showWorks();


// Fonction pour initialiser le menu des catégories
async function showCategories() {
  const data = await fetchData('http://localhost:5678/api/categories'); // Remplacez par l'URL de votre API des catégories
  const container = document.createElement('div'); // Créer un conteneur pour le menu
  container.id = 'menu_container'; // ID du conteneur

  let menuHTML = ''; // Initialiser une chaîne de caractères vide pour le menu

  data.forEach(function(category) {
    // Construire le HTML pour chaque catégorie
    menuHTML += `
      <li>${category.name}</li> 
    `;
  });

  const menu = document.createElement('ul'); // Créer une liste non ordonnée
  menu.id = 'menu_categories'; // ID du menu
  menu.innerHTML = menuHTML; // Ajouter le contenu du menu

  container.appendChild(menu); // Ajouter le menu au conteneur
  document.body.appendChild(container); // Ajouter le conteneur à la fin du body
}

// Appel de la fonction pour initialiser les catégories
showCategories();