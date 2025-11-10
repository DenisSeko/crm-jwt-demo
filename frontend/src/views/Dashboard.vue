<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Klijenti</h1>
      <button @click="showForm = true; editing = null" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        + Dodaj klijenta
      </button>
    </div>

    <div v-if="showForm" class="mb-6 p-4 bg-gray-50 rounded border">
      <h3 class="font-bold mb-3">{{ editing ? 'Uredi klijenta' : 'Novi klijent' }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <input v-model="form.name" placeholder="Ime klijenta *" class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="form.email" placeholder="Email *" type="email" class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="form.company" placeholder="Kompanija (opciono)" class="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="flex space-x-2">
        <button @click="saveClient" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          {{ editing ? 'Ažuriraj' : 'Dodaj' }}
        </button>
        <button @click="cancelForm" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
          Otkaži
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>Učitavanje klijenata...</p>
    </div>

    <div v-else-if="clients.length === 0" class="text-center py-8 bg-white rounded shadow">
      <p class="text-gray-500">Nema klijenata. Dodajte prvog klijenta!</p>
    </div>

    <div v-else class="grid gap-4">
      <div v-for="client in clients" :key="client.id" class="p-4 bg-white rounded shadow hover:shadow-md transition">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-800">{{ client.name }}</h3>
            <p class="text-gray-600">{{ client.email }}</p>
            <p v-if="client.company" class="text-gray-500 text-sm">{{ client.company }}</p>
            <p class="text-gray-400 text-xs mt-1">
              Kreirano: {{ new Date(client.created_at).toLocaleString('hr-HR') }}
            </p>
          </div>
          <div class="flex space-x-2 ml-4">
            <button @click="editClient(client)" class="text-blue-600 hover:text-blue-800 transition" title="Uredi">
              ✏️
            </button>
            <button @click="deleteClient(client.id)" class="text-red-600 hover:text-red-800 transition" title="Obriši">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';

const clients = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editing = ref(null);
const form = ref({ name: '', email: '', company: '' });

const loadClients = async () => {
  loading.value = true;
  try {
    const res = await api.get('/clients');
    clients.value = res.data;
  } catch (err) {
    console.error('Error loading clients:', err);
    alert('Greška pri učitavanju klijenata');
  } finally {
    loading.value = false;
  }
};

const saveClient = async () => {
  if (!form.value.name || !form.value.email) {
    alert('Ime i email su obavezni');
    return;
  }

  try {
    if (editing.value) {
      await api.put(`/clients/${editing.value.id}`, form.value);
    } else {
      await api.post('/clients', form.value);
    }
    cancelForm();
    loadClients();
  } catch (err) {
    alert(err.response?.data?.error || 'Greška pri čuvanju klijenta');
  }
};

const editClient = (client) => {
  form.value = { ...client };
  editing.value = client;
  showForm.value = true;
};

const deleteClient = async (id) => {
  if (confirm('Jeste li sigurni da želite obrisati ovog klijenta?')) {
    try {
      await api.delete(`/clients/${id}`);
      loadClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri brisanju klijenta');
    }
  }
};

const cancelForm = () => {
  form.value = { name: '', email: '', company: '' };
  showForm.value = false;
  editing.value = null;
};

onMounted(loadClients);
</script>
