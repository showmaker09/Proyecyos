import VillainRepository from '../repositories/villainRepository.js'

async function getAllVillains() {
    return await VillainRepository.getVillains()
}

async function addVillain(villain) {
    if (!villain.name || !villain.alias) {
        throw new Error("El villano debe tener un nombre y un alias.");
    }

    const villains = await villainRepository.getVillains();

    const newId = villains.length > 0 ? Math.max(...villains.map(h => h.id)) + 1 : 1;
    const newVillain = { ...villain, id: newId };

    villains.push(newVillain);
    await villainRepository.saveVillains(villains);

    return newVillain;
}

async function updateVillain(id, updatedVillain) {
    const villains = await villainRepository.getVillains();
    const index = villains.findIndex(villain => villain.id === parseInt(id));

    if (index === -1) {
        throw new Error('Villano no encontrado');
    }

    delete updatedVillain.id;
    villains[index] = { ...villains[index], ...updatedVillain };

    await villainRepository.saveVillains(villains);
    return villains[index];
}


async function deleteVillain(id) {
    const villains = await villainRepository.getVillains();
    const index = villains.findIndex(villain => villain.id === parseInt(id));

    if (index === -1) {
        throw new Error('Villano no encontrado');
    }

    const filteredVillains = villains.filter(villain => villain.id !== parseInt(id));
    await villainRepository.saveVillains(filteredVillains);
    return { message: 'Villano eliminado' };
}

async function findVillainsByCity(city) {
  const villains = await villainRepository.getVillains();
  return villains.filter(villain => villain.city.toLowerCase() === city.toLowerCase());
}

async function getVillainByName(name) {
    const villains = await VillainRepository.getVillains();
    // Busca por alias o nombre real, ignorando mayúsculas/minúsculas
    return villains.find(villain =>
        (villain.alias && villain.alias.toLowerCase() === name.toLowerCase()) ||
        (villain.name && villain.name.toLowerCase() === name.toLowerCase())
    );
}


export default {
    getAllVillains,
    addVillain,
    updateVillain,
    deleteVillain,
    findVillainsByCity,
    getVillainByName
}