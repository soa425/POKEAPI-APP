export const typeColors = {
  grass: '#7AC74C', fire: '#EE8130', water: '#6390F0',
  bug: '#A6B91A', normal: '#A8A77A', poison: '#A33EA1',
  electric: '#F7D02C', ground: '#E2BF65', fairy: '#DDA0DD', 
  fighting: '#C22E28', psychic: '#F95587', rock: '#B6A136',
  ghost: '#735797', ice: '#96D9D6', dragon: '#6F35FC', 
  steel: '#B7B7CE', dark: '#705746', flying: '#A98FF3'
};

export const getTypeColor = (type) => typeColors[type] || '#68A090';

export const formatPokemonId = (id) => `#${String(id).padStart(3, '0')}`;